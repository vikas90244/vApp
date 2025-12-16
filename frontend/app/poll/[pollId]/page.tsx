'use client';

import { useEffect, useState, useCallback } from 'react';
import { useVote } from '@/hooks/useVote';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getBoothProgram } from '@/utils/anchor';
import { AnchorProvider } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
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
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [votingError, setVotingError] = useState<string | null>(null);
  const [votingErrorDetails, setVotingErrorDetails] = useState<string | null>(null);
  const { voteSolana, createBackendVote } = useVote();
  const { connection } = useConnection();
  const wallet: any = useWallet();

  const handleSelect = useCallback((candidate:Candidate) => {
    setSelectedCandidate(candidate);
  }, []);




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
        
        // Try to fetch on-chain candidate counts and merge them into backend data
        try {
          const provider = new AnchorProvider(connection, wallet, {});
          const program = getBoothProgram(provider);
          const pollIdBytes = Buffer.from(data.poll_id, 'hex');

          for (const c of data.candidates) {
            try {
              const [candidatePDA] = PublicKey.findProgramAddressSync([
                Buffer.from(pollIdBytes),
                Buffer.from(c.name),
              ], program.programId);
              const onChain = await program.account.candidate.fetch(candidatePDA);
              // onChain candidate account fields may be snake_case (candidate_votes) or camelCase (candidateVotes)
              let onChainVotes = 0;
              if (onChain) {
                const anyOn = onChain as any;
                const votesField = anyOn.candidate_votes ?? anyOn.candidateVotes ?? anyOn.candidate_votes ?? anyOn.candidateVotes;
                if (votesField && typeof votesField.toNumber === 'function') {
                  onChainVotes = votesField.toNumber();
                } else {
                  onChainVotes = Number(votesField ?? 0);
                }
              }
              c.votes = typeof onChainVotes === 'number' && !isNaN(onChainVotes) ? onChainVotes : c.votes;
            } catch (err) {
              // If account not found or error, keep backend value and continue
              console.warn('Failed to fetch on-chain candidate for', c.name, err);
            }
          }
        } catch (err) {
          console.warn('Failed to load on-chain counts (continuing with backend values):', err);
        }

        setPoll({
          ...data,
          isPollEnded,
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

    setVotingError(null);
    setIsSubmitting(true);
    
      try {
      // First perform on-chain vote which will create the voter PDA
      await voteSolana.mutateAsync({
        pollId: selectedCandidate.poll_id,
        candidateName: selectedCandidate.name,
          candidateId: selectedCandidate.id,
      });
      // Mark as voted (on-chain vote succeeded)
      setHasVoted(true);

      // Then record vote in backend (if this fails we still keep hasVoted true but show an error)
        try {
          // Pass voter pubkey from wallet explicitly to backend
          const voter_pubkey = wallet?.publicKey?.toBase58();
          await createBackendVote.mutateAsync({ candidateId: selectedCandidate.id, voter_pubkey });
        } catch (err: any) {
          console.error('Backend vote failed:', err);
          setVotingError('Vote recorded on-chain but failed to update the backend.');
        }
    } catch (error: any) {
      console.error('Error voting:', error);
      
      if (error?.message) {
        if (error.message.includes('Already voted')) {
          setVotingError('You have already voted in this poll.');
          setHasVoted(true);
        } else if (error.message.includes('Wallet not connected')) {
          setVotingError('Please connect your wallet to vote.');
        } else if (error.message.includes('Program not loaded')) {
          setVotingError('Error initializing voting program. Please try again.');
        } else if (error.message.includes('Poll has not started yet')){
          setVotingError("poll not started yet");
        }
        else {
          setVotingError('An error occurred while processing your vote. Please try again.');
        }
      } else {
        setVotingError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedCandidate, voteSolana, createBackendVote]);

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
          {/* Global voting error banner (shows even if user already voted) */}
          {votingError && (
            <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
              {votingError}
            </div>
          )}
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
                  <div className="mt-6 space-y-4">
                    <button
                      onClick={handleVote}
                      disabled={!selectedCandidate || isSubmitting || hasVoted}
                      className={`w-full px-8 py-3 rounded-lg font-semibold transition-all ${
                        isSubmitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : hasVoted
                          ? 'bg-green-500 text-white cursor-not-allowed'
                          : selectedCandidate
                          ? 'bg-purple-500 hover:bg-purple-600 text-white'
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : hasVoted ? 'Vote Submitted!' : 'Submit Vote'}
                    </button>
                    
                    {votingError && (
                      <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                        {votingError}
                      </div>
                    )}
                    
                    {hasVoted && (
                      <div className="p-3 text-sm text-green-700 bg-green-50 rounded-lg border border-green-200">
                        Your vote has been recorded successfully!
                      </div>
                    )}
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
