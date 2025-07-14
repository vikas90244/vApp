'use client';

import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';

export default function WalletButton() {
  const { setVisible } = useWalletModal();
  const { publicKey, connected, disconnect } = useWallet();
  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  const shortKey = publicKey?.toBase58();
  const label = connected
    ? `Disconnect (${shortKey?.slice(0, 4)}...${shortKey?.slice(-4)})`
    : 'Connect Wallet';

  return (
    <Button
      onClick={handleClick}
      className="bg-gray-400 hover:bg-gray-600  mr-12 text-white border-2 border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black flex items-center gap-2"
    >
        <span>{label}</span>
    </Button>
  );
}
