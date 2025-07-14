"use client"
import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Button } from "@/components/ui/button";

export default function AirdropButton({
  amount = 2,
  className = "",
}: {
  amount?: number; // SOL amount
  className?: string;
}) {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAirdrop = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (!publicKey) throw new Error("Wallet not connected");
      const sig = await connection.requestAirdrop(
        publicKey,
        amount * LAMPORTS_PER_SOL
      );
      // Wait for confirmation
      await connection.confirmTransaction(sig, "confirmed");
      setSuccess(`Airdropped ${amount} SOL!`);
    } catch (e: any) {
      setError(e?.message || "Airdrop failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      <Button
        onClick={handleAirdrop}
        disabled={!connected || loading}
        variant="outline"
      >
        {loading ? "Requesting..." : `Airdrop ${amount} SOL`}
      </Button>
      {success && <span className="text-green-600 text-sm">{success}</span>}
      {error && <span className="text-red-600 text-sm">{error}</span>}
    </div>
  );
}
