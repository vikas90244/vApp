import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { getBoothProgram, getBoothProgramId } from "@/utils/anchor";
import { useNetwork } from "@/contexts/Wallet-Provider";
import { AnchorProvider } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { BN } from "bn.js";
import { useMutation } from "@tanstack/react-query"
import { PollFormValues } from "@/utils/interface";
import { retryQueue } from "@/lib/retryQueue";



export const usePoll = () => {

      const wallet: any = useWallet();
      const { connection } = useConnection();
      const provider = new AnchorProvider(connection, wallet, {});
      const { network } = useNetwork();
      const program = getBoothProgram(provider);
      const programId = getBoothProgramId(network);


  const deployPollSolana = useMutation({
    mutationFn: async (data: PollFormValues) => {

      if (!wallet.publicKey) {
        console.error("wallet pubkey not found");
        throw new Error("wallet not connected");
      }

      if (!program) {
        console.error("failed to load program");
        throw new Error("program not loaded");
      }


     // 1. Create pollId (BN) and pollIdHex (string to send to backend)
      const randomBytes = crypto.getRandomValues(new Uint8Array(16));
      const pollId = new BN(randomBytes, 16, "le");
      const pollIdBytes = pollId.toArray("le", 16); // 16 bytes, little-endian
      const pollIdHex = Buffer.from([...pollIdBytes]).toString("hex");
      const walletAddress = wallet.publicKey?.toBase58();

      console.log(pollIdBytes);
      // 2. creat unix timestamp
        const pollStartUnix = new BN(
        Math.floor(new Date(data.pollStart).getTime() / 1000),
      );
      const pollEndUnix = new BN(
        Math.floor(new Date(data.pollEnd).getTime() / 1000),
      );

      // create PDA account for poll
      const [pollAccountPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from(pollIdBytes)], program.programId,);
      const transaction = new Transaction();


      // Add poll initialization instruction

      const pollIx = await program.methods

        .initializePoll(
          pollId,
          data.description,
          pollStartUnix,
          pollEndUnix,
        )

        .accountsPartial({
          signer: wallet.publicKey,
          poll: pollAccountPDA,
        })

        .instruction();
      transaction.add(pollIx);



      // create candidate in backend
      const candidateNames = data.candidates
        .filter((c) => c.name.trim() !== "")
        .map((c) => c.name.trim());

      for (const candidateName of candidateNames) {
        console.log("attempting to create candidate: ", candidateName);

        const [candidateAccountPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from(pollIdBytes), Buffer.from(candidateName)],
          program.programId,
        );

        const candidateIx = await program.methods
          .initializeCandidate(
            candidateName,
            pollId,
          )
          .accountsPartial({
            signer: wallet.publicKey,
            poll: pollAccountPDA,
            candidate: candidateAccountPDA,
          })

          .instruction();
        transaction.add(candidateIx);
      }
      const latestBlockhash = await connection.getLatestBlockhash("finalized");
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = wallet.publicKey;
      const signedTx = await wallet.signTransaction(transaction);

      // Send the consolidated transaction (single signature)
      const txSignature = await connection.sendRawTransaction(signedTx.serialize());


      // Confirm the transaction using blockhash and lastValidBlockHeight
      const result = await connection.confirmTransaction(
        {
          signature: txSignature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        "confirmed",
      );
      const pollData = {
        pollId: pollIdHex,
        pollTitle: data.pollTitle,
        description: data.description,
        pollStart: data.pollStart,
        pollEnd: data.pollEnd,
        candidates: data.candidates,
        walletAddress: walletAddress,
      };

      try {
        const response = await fetch('/api/create-poll/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pollData),
        });

        if (!response.ok) {
          throw new Error('Failed to create poll in backend');
        }

        return await response.json();
      } catch (error) {
        console.log('Adding to retry queue', error);
        retryQueue.addToRetryQueue({
          type: 'create_poll',
          payload: pollData,
          retryCount: 0,
        });
        throw error;
      }
    },

    onSuccess: (data) => {
      console.log("sucessfull with ", data);
    },
    onError: (error) => {
      // log error
      console.error(error);
    }
  })


  return {
    deployPollSolana
  }
}
