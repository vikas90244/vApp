'use client';

import { useEffect, useState, useCallback } from 'react';
import { PollCard } from '@/components/poll/PollCard';
import { useWallet } from '@solana/wallet-adapter-react';
import { Poll } from '@/components/poll/PollCard';
import WalletButton from '@/components/buttons/Wallet-Button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

// Skeleton component for poll cards
const PollCardSkeleton = () => (
  <div className="border-2 border-black rounded-xl bg-white p-6 mt-16 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
    <div className="flex justify-between items-start mb-4">
      <Skeleton className="h-8 w-3/4 mb-2" />
      <Skeleton className="h-6 w-16" />
    </div>
    <Skeleton className="h-5 w-1/2 mb-4" />
    <div className="space-y-3 mb-6">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
    <div className="flex justify-between items-center">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

export default function MyPollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { publicKey } = useWallet();

  const fetchPolls = async () => {
    if (!publicKey) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/my-poll/${publicKey.toBase58()}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch your polls');
      }
      const data = await response.json();
      setPolls(data || []);
    } catch (err) {
      console.error('Error fetching your polls:', err);
      setError('Failed to load your polls. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePollDeleted = async (pollId: string) => {
    try {
      const response = await fetch(`/api/delete-poll/${pollId}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete poll');
      }

      // Update UI optimistically
      setPolls(prevPolls => prevPolls.filter(poll => poll.poll_id !== pollId));

    } catch (err) {
      console.error('Error deleting poll:', err);
      // Refresh the list if there was an error
      fetchPolls();
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 bg-gray-50 px-4 text-center">
        <h2 className="text-3xl font-black text-black">Connect Your Wallet</h2>
        <p className="text-gray-600">Sign in with your wallet to see your polls</p>
        <div className="wallet-connect-button">
          <WalletButton />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-10 text-center">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-5 w-80 mx-auto" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <PollCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-black mb-2">🎯 My Polls</h1>
        <p className="text-gray-600">View and manage the polls you've created</p>
      </div>

      {polls.length === 0 ? (
        <div className="text-center py-16 border-2 border-black rounded-xl bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-gray-600 mb-6 text-lg font-medium">You haven't created any polls yet.</p>
          <Link
            href="/create-poll"
            className="inline-flex items-center gap-2 px-6 py-2 bg-yellow-300 text-black font-bold rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            ➕ Create Your First Poll
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {polls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              onPollDeleted={handlePollDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
