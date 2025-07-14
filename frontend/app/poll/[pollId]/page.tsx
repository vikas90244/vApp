'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { VotingOptions } from '@/components/poll/VotingOptions';
import { SuccessMessage } from '@/components/poll/SuccessMessage';
import { Check, BarChart2, Users, Clock, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow, format } from 'date-fns';

export type Candidate = {
  id: string;
  name: string;
  poll_id: string;
  votes: number;
  percentage?: number;
};

type Poll = {
  id: number;
  poll_id: string;
  poll_title: string;
  description: string;
  poll_start: string;
  poll_end: string;
  votes: number;
  creator_wallet_key: string;
  created_at: string;
  candidates: Candidate[];
  userVoted?: boolean;
  isPollEnded: boolean;
};

export default function PollPage() {

  const { pollId } = useParams() as { pollId: string };
  console.log("pollId page is re-rendering, fix me first ");
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading ]= useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleSelect = useCallback((candidate:Candidate) => {
    setSelectedCandidate(candidate);
  }, []);

  console.log("selected candidate from handle select ", selectedCandidate);



  useEffect(() => {
//  fetching poll from API
    const fetchPoll = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/poll/${pollId}`);
        if (!res.ok) throw new Error('Failed to fetch poll');
        const data = await res.json();
        const pollEnd = new Date(data.poll_end);
        const localPollEnd = new Date(pollEnd.getTime() + (pollEnd.getTimezoneOffset() * 60000));
        const isPollEnded = localPollEnd < new Date();
        
        setPoll({
          ...data,
          isPollEnded
        });
      } catch (error) {
        console.error('Error loading poll:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoll();
  }, [pollId]);

  const handleVote = useCallback(async () => {
    if (!selectedCandidate) return;
    console.log("selected candidate from handleVote ", selectedCandidate);

    setIsSubmitting(true);
    try {
      // Simulate vote (replace with actual Solana TX later)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasVoted(true);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedCandidate]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if(isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-8 bg-white p-6 rounded-lg border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4 mb-2" />

              {/* Description Skeleton */}
              <div className="bg-amber-50 p-5 rounded-lg -mx-2">
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-5 w-3/4 mt-2" />
              </div>

              {/* Metadata Skeleton */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Skeleton className="h-8 w-48 rounded-full" />
                <Skeleton className="h-8 w-36 rounded-full" />
                <Skeleton className="h-8 w-32 rounded-full" />
              </div>
            </div>
          </div>

          {/* Voting Options Skeleton */}
          <div className="bg-white p-6 rounded-lg border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border-2 border-gray-200 rounded-lg">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}

              {/* Submit Button Skeleton */}
              <div className="mt-8">
                <Skeleton className="h-12 w-40 mx-auto rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!poll) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-3xl font-black mb-4">Poll not found</h2>
          <p className="text-gray-600 mb-6">The poll you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/explore"
            className="inline-flex items-center px-6 py-3 bg-yellow-300 text-black font-bold rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            ← Back to Explore
          </Link>
        </div>
      </div>
    );
  }


  // -------- Poll Metadata --------
  const pollEnd = new Date(poll.poll_end);
  const localPollEnd = new Date(pollEnd.getTime() + (pollEnd.getTimezoneOffset() * 60000));
  const pollEndsInMs = formatDistanceToNow(localPollEnd, { addSuffix: true });

  return (
    <div className="min-h-screen  pt-16 bg-gray-50 relative overflow-x-hidden">

      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 relative">

        {/* Poll Header */}

        <div className="mb-8 bg-white p-6 rounded-lg border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-black text-gray-900 ">{poll.poll_title}</h1>

            {/* Enhanced Description */}

            {poll.description && (
              <div className="relative bg-gradient-to-r from-yellow-50 to-amber-50 p-5 rounded-lg border-l-4 border-amber-400 -mx-2">
                <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-12 bg-amber-400 rounded-full"></div>
                <div className="relative">
                  <div className="absolute -top-3 -left-3 text-amber-400 text-4xl"></div>
                  <p className="text-gray-800 text-base md:text-lg leading-relaxed pl-4">
                    {poll.description}
                  </p>
                  <div className="absolute -bottom-3 -right-3 text-amber-400 text-4xl transform rotate-180">"</div>
                </div>
              </div>
            )}


            {/* Poll Metadata */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-gray-600">
              <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                <Users className="w-4 h-4 mr-2 text-blue-500" />
                <span className="font-medium hidden sm:flex">by {poll.creator_wallet_key}</span>
                <span className="font-medium flex sm:hidden">by {`${poll.creator_wallet_key.slice(0, 4)}...${poll.creator_wallet_key.slice(-3)}`}</span>
              </div>
              <div className="flex items-center bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
                <Clock className="w-4 h-4 mr-2 text-purple-500" />
                <span>{pollEndsInMs}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Voting Options */}
        <div className="bg-white p-6 rounded-lg border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          {poll.isPollEnded ? (
            <>
              <VotingOptions
                candidates={poll.candidates}
                selectedCandidate={selectedCandidate}
                onSelect={() => {}}
                showResults={true}
              />
            </>
          ) : (
            <>
              {!hasVoted ? (
                <>
                  <VotingOptions
                    candidates={poll.candidates}
                    selectedCandidate={selectedCandidate}
                    onSelect={handleSelect}
                    showResults={false}
                  />
                  <div className="mt-8">
                    <button
                      onClick={handleVote}
                      disabled={!selectedCandidate || isSubmitting}
                      className={`w-full px-8 py-3 rounded-lg font-semibold transition-all ${
                        isSubmitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : selectedCandidate
                          ? 'bg-purple-500 hover:bg-purple-600 text-white'
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Vote'}
                    </button>
                  </div>
                </>
              ) : (
                <SuccessMessage />
              )}
            </>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Poll ID: {poll.poll_id} • Created on{' '}
            {new Date(poll.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
