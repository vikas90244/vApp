import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { getBoothProgram, getBoothProgramId } from "@/utils/anchor";
import { useNetwork } from "@/contexts/Wallet-Provider";
import { AnchorProvider } from "@coral-xyz/anchor";
import { useMutation } from "@tanstack/react-query";

interface voteType{
    pollId: string;
    candidateName: string;

}
export const useVote =() =>{
    const wallet: any = useWallet();
    const { connection } = useConnection();
    const provider = new AnchorProvider(connection, wallet, {});
    const { network } = useNetwork();
    const program = getBoothProgram(provider);
    const programId = getBoothProgramId(network);


    const voteSolana = useMutation({
        mutationFn: async()=>{


            if (!wallet.publicKey) {
                console.error("wallet pubkey not found");
                throw new Error("wallet not connected");
            }

            if (!program) {
                console.error("failed to load program");
                throw new Error("program not loaded");
            }


        },
        onSuccess:()=>{},
        onError:()=>{},
    })
    const createBackendVote = useMutation({
        mutationFn: async()=>{},
        onSuccess:()=>{},
        onError:()=>{},
    })
    return {
        voteSolana,
        createBackendVote,
    }
}
