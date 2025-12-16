// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import boothIdlJson from '../idl/booth.json';
import type { Booth } from '../types/booth';

// Re-export the generated IDL and type
export { Booth, boothIdlJson };

// The programId is imported from the program IDL.
export const BOOTH_PROGRAM_ID = new PublicKey(boothIdlJson.address);

// This is a helper function to get the Booth Anchor program.
export function getBoothProgram(provider: AnchorProvider, address?: PublicKey) : Program<Booth> {
  return new Program({ ...boothIdlJson, address: address ? address.toBase58() : boothIdlJson.address } as Booth, provider);
}

type Network = Cluster | 'localnet';
// This is a helper function to get the program ID for the Booth program depending on the cluster.
export function getBoothProgramId(cluster: Network) {
  switch (cluster) {
    case 'devnet':
      return new PublicKey("CahoJqP45XiXju2xgj5nCKHEhbYJJmCU19X78sfpJEhr");
    case 'testnet':
      // This is the program ID for the Booth program on devnet and testnet.
      return new PublicKey('412xBQyi1GemTVD5scmBspRRHroh154DNZcAcJeay2or');
    case 'mainnet-beta':
    default:
      console.log('booth program id is: ', BOOTH_PROGRAM_ID);
      return BOOTH_PROGRAM_ID;
  }
}