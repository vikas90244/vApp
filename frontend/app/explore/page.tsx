'use client';

import { useEffect, useState } from 'react';
import { PollCard } from '@/components/poll/PollCard';
import Link from 'next/link';
import { Candidate, Poll } from '@/components/poll/PollCard';
import { Skeleton } from '@/components/ui/skeleton';

// Reusing the same PollCardSkeleton from my-polls page
const PollCardSkeleton = () => (
  <div className="border-2 border-black rounded-xl bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
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

export default function ExplorePage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handlePollDeleted = async (poll_id: string) => {
    setPolls(polls.filter((poll) => poll.poll_id !== poll_id));
    try {
        const data = await fetch('/api/polls');
        if (!data.ok) {
          throw new Error('Failed to fetch polls');
        }
        const polls = await data.json();
        setPolls(polls);
      } catch (err) {
        console.error("Error refetching after delete:", err);
      }
  };

  useEffect(() => {
    const fetchPolls = async () => {
      console.log("trying to fetch the polls in explore page");
      setLoading(true);
      try {
        console.log("trying to fetch the polls in explore page");
        const response = await fetch('/api/polls/');
        if (!response.ok) {
          throw new Error('Failed to fetch polls');
        }
        const data = await response.json();
        console.log(data);
        setPolls(data);
      } catch (err) {
        console.error('Error fetching polls:', err);
        setError('Failed to load polls. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-6 rounded-lg border-2 border-red-200 shadow-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Polls</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-300 text-black font-medium rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-black mb-2">🌐 Explore Polls</h1>
        <p className="text-gray-600">Discover and vote on polls created by the community</p>
      </div>

      {polls.length === 0 ? (
        <div className="text-center py-16 border-2 border-black rounded-xl bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-gray-600 mb-6 text-lg font-medium">No polls found. Be the first to create one!</p>
          <Link
            href="/create-poll"
            className="inline-flex items-center gap-2 px-6 py-2 bg-yellow-300 text-black font-bold rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            ➕ Create a Poll
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
