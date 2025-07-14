'use client';
import React, {
  useMemo,
  useState,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';
import { Cluster } from '@solana/web3.js';


type Network = Cluster | 'localnet';
const ENDPOINTS: Record<Network, string> = {
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
  'mainnet-beta': 'https://api.mainnet-beta.solana.com',
  localnet: 'http://localhost:8899',
};

export const NetworkContext = createContext<{
  network: Network;
  setNetwork: Dispatch<SetStateAction<Network>>;
}>({
  network: 'devnet',
  setNetwork: () => {},
});

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  const [network, setNetwork] = useState<Network>('devnet');
  const endpoint = ENDPOINTS[network];

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <NetworkContext.Provider value={{ network, setNetwork }}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </NetworkContext.Provider>
  );
}

// Optional hook for easy access
export const useNetwork = () => useContext(NetworkContext);
