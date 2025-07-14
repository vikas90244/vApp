"use client"
import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Rocket, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AirdropPrompt({
  minSol = 0.1,
  amount = 2,
  className = "",
}: {
  minSol?: number; // Minimum SOL to hide prompt
  amount?: number; // Airdrop amount
  className?: string;
}) {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  // Fetch wallet balance
  useEffect(() => {
    let cancelled = false;
    async function fetchBalance() {
      if (connected && publicKey) {
        try {
          const lamports = await connection.getBalance(publicKey);
          if (!cancelled) setBalance(lamports / LAMPORTS_PER_SOL);
        } catch {
          if (!cancelled) setBalance(null);
        }
      } else {
        setBalance(null);
      }
    }
    fetchBalance();
    return () => {
      cancelled = true;
    };
  }, [connected, publicKey, connection]);

  // Show/hide prompt based on balance
  useEffect(() => {
    if (connected && typeof balance === "number" && balance < minSol) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [connected, balance, minSol]);

  const handleAirdrop = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!publicKey) throw new Error("Wallet not connected");
      const sig = await connection.requestAirdrop(
        publicKey,
        amount * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(sig, "confirmed");
      setVisible(false);
    } catch (e: any) {
      setError(e?.message || "Airdrop failed");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className={`fixed top-4 left-1/2 z-50 opacity-100 -translate-x-1/2 flex justify-center bg-transparent pointer-events-none ${className}`}> 
      <div className="pointer-events-auto bg-yellow-100 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] px-6 py-4 flex flex-col items-center gap-2 animate-fade-in max-w-md w-full">
        <div className="flex items-center gap-2">
          <Rocket className="w-6 h-6 text-yellow-500 -rotate-6" />
          <span className="text-lg font-black text-black">Need SOL to Start?</span>
        </div>
        <div className="flex items-center gap-2 bg-yellow-200 border-2 border-yellow-400 px-2 py-1 rounded-lg">
          <AlertCircle className="w-4 h-4 text-yellow-800" />
          <span className="text-yellow-900 font-bold text-sm">Your wallet has no SOL on localnet.</span>
        </div>
        <Button
          onClick={handleAirdrop}
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 border-2 border-black text-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6 py-2 text-base rounded-xl mt-1"
        >
          {loading ? "Requesting..." : `Airdrop ${amount} SOL`}
        </Button>
        {error && <span className="text-red-600 font-bold text-xs mt-1">{error}</span>}
      </div>
    </div>
  );
}

