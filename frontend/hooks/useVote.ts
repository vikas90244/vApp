import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { getBoothProgram, getBoothProgramId } from "@/utils/anchor";
import { useNetwork } from "@/contexts/Wallet-Provider";
import { AnchorProvider } from "@coral-xyz/anchor";
import { useMutation } from "@tanstack/react-query";
import { PublicKey, Transaction, SystemProgram, SendTransactionError } from "@solana/web3.js";
import { BN } from "bn.js";
import { BACKEND_URL } from "@/config";

interface VoteType {
    pollId: string; // hex string created when poll was initialized
    candidateName: string;
    candidateId: string; // backend candidate id to record vote in DB
}

export const useVote = () => {
    const wallet: any = useWallet();
    const { connection } = useConnection();
    const provider = new AnchorProvider(connection, wallet, {});
    const { network } = useNetwork();
    const program = getBoothProgram(provider);
    const programId = getBoothProgramId(network);

    // Mutation: perform on-chain vote
    const voteSolana = useMutation({
        mutationFn: async (payload: VoteType) => {
            try {
                const { pollId, candidateName } = payload;

                // Validate inputs early to avoid confusing Buffer errors later
                if (!pollId) {
                    throw new Error('pollId is required for on-chain voting. Ensure selectedCandidate.poll_id is provided and passed to useVote.');
                }
                if (!candidateName) {
                    throw new Error('candidateName is required for on-chain voting.');
                }

                if (!wallet.publicKey) {
                    throw new Error("Wallet not connected");
                }
                if (!program) {
                    throw new Error("Program not loaded");
                }

                // reconstruct pollId bytes (little-endian hex stored in backend)
                let pollIdBytes: Buffer;
                try {
                    pollIdBytes = Buffer.from(pollId, "hex");
                } catch (bufErr: any) {
                    // Re-throw with a clearer message about the expected shape
                    throw new Error(`Failed to parse pollId hex string: ${String(bufErr)}. Received pollId=${String(pollId)}`);
                }

                // compute PDAs
                const [pollPDA] = PublicKey.findProgramAddressSync(
                    [Buffer.from(pollIdBytes)],
                    program.programId
                );

                const [candidatePDA] = PublicKey.findProgramAddressSync(
                    [Buffer.from(pollIdBytes), Buffer.from(candidateName)],
                    program.programId
                );

                const [voterPDA] = PublicKey.findProgramAddressSync(
                    [Buffer.from(pollIdBytes), wallet.publicKey.toBuffer()],
                    program.programId
                );

                // Check if voter account already exists => prevent double voting client-side
                const voterAccount = await connection.getAccountInfo(voterPDA);
                if (voterAccount) {
                    // Voter PDA already exists: user already voted
                    throw new Error("Already voted");
                }

                // Build BN for poll id (little endian)
                const pollBN = new BN(pollIdBytes, 16, "le");

                const tx = new Transaction();

                const voteIx = await program.methods
                    .vote(candidateName, pollBN)
                    .accountsPartial({
                        signer: wallet.publicKey,
                        poll: pollPDA,
                        candidate: candidatePDA,
                        voter: voterPDA,
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();

                tx.add(voteIx);

                const latestBlockhash = await connection.getLatestBlockhash("finalized");
                tx.recentBlockhash = latestBlockhash.blockhash;
                tx.feePayer = wallet.publicKey;

                const signed = await wallet.signTransaction(tx);
                const sig = await connection.sendRawTransaction(signed.serialize());

                await connection.confirmTransaction(
                    {
                        signature: sig,
                        blockhash: latestBlockhash.blockhash,
                        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
                    },
                    "confirmed"
                );

                return { tx: sig };
            } catch (error: any) {
                console.error("Vote error:", error);

                // If this is a SendTransactionError from @solana/web3.js, try to extract program logs
                try {
                    // If the error exposes a `getLogs` helper, call it (some web3 versions provide this)
                    if (typeof error.getLogs === 'function') {
                        const logs = await error.getLogs();
                        console.error('Transaction logs (from getLogs):', logs);
                        const enhanced = new Error(`${error.message}\n\nProgram logs:\n${Array.isArray(logs) ? logs.join('\n') : String(logs)}`);
                        throw enhanced;
                    }

                    // Some errors include a `logs` array property already
                    if (Array.isArray(error.logs)) {
                        console.error('Transaction logs (from error.logs):', error.logs);
                        const enhanced = new Error(`${error.message}\n\nProgram logs:\n${error.logs.join('\n')}`);
                        throw enhanced;
                    }
                } catch (extractErr) {
                    // If extracting logs failed, fall back to re-throwing the original error (or the extraction error)
                    console.error('Failed to extract transaction logs:', extractErr);
                    if (extractErr instanceof Error) throw extractErr;
                }

                // Re-throw original error if we couldn't augment it
                throw error;
            }
        },
        onError: (error: Error) => {
            console.error("voteSolana error", error);
            // The error will be re-thrown and caught by the component
        },
    });

    // Mutation: record vote in backend database (Django)
    // Expect payload: { candidateId: string, voter_pubkey?: string }
    const createBackendVote = useMutation({
        mutationFn: async (payload: { candidateId: string; voter_pubkey?: string }) => {
            const { candidateId, voter_pubkey } = payload;
            const vp = voter_pubkey ?? wallet.publicKey?.toBase58();

            if (!vp) {
                throw new Error('voter_pubkey is required');
            }

            // Call the internal Next.js API route (same-origin) so the browser doesn't trigger CORS preflight
            const res = await fetch(`/api/vote/${candidateId}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ voter_pubkey: vp }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || 'Failed to record vote in backend');
            }
            return res.json();
        },
        onError: (err) => {
            console.error('createBackendVote error', err);
        },
    });

    return {
        voteSolana,
        createBackendVote,
    };
};
