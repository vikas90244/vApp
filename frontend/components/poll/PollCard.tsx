'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, BarChart2, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { apiService } from '@/lib/api.service';
export type Candidate = {
  id: string;
  name: string;
  poll_id: string;
  votes: number;
};

export type Poll = {
  id: number;
  poll_id: string;
  poll_title: string;
  description: string;
  poll_start: number;
  poll_end: number;
  votes: number;
  creator_wallet_key: string;
  created_at: string;
  candidates: Candidate[];
  userVoted?: boolean;
};

const getOptionColor = (percentage: number) => {
  if (percentage > 50) return 'bg-gradient-to-r from-blue-500 to-indigo-600';
  if (percentage > 30) return 'bg-gradient-to-r from-green-500 to-emerald-600';
  if (percentage > 15) return 'bg-gradient-to-r from-amber-400 to-orange-500';
  return 'bg-gradient-to-r from-pink-500 to-rose-500';
};

export const PollCard = ({ poll, onPollDeleted }: { poll: Poll, onPollDeleted: (poll_id: string) => void }) => {
   const wallet: any = useWallet();
  const [showAllOptions, setShowAllOptions] = useState(false);
  const maxVisibleOptions = 3;
  const hasMoreOptions = poll.candidates.length > maxVisibleOptions;
  const totalVotes = poll.candidates.reduce((sum, c) => sum + c.votes, 0);
  const now = Date.now();
  const timeLeftMs = poll.poll_end - now;

  const timeLeft = (() => {
    if (timeLeftMs <= 0) return 'Ended';

    const hoursLeft = Math.floor(timeLeftMs / (1000 * 60 * 60));
    if (hoursLeft >= 1) return `${hoursLeft}h left`;

    const minutesLeft = Math.floor(timeLeftMs / (1000 * 60));
    return `${minutesLeft}m left`;
  })();


  const visibleOptions = (showAllOptions
    ? poll.candidates
    : poll.candidates.slice(0, maxVisibleOptions)
  ).map((candidate) => {
    const percentage =
      totalVotes === 0 ? 0 : Math.round((candidate.votes / totalVotes) * 100);
    return { ...candidate, name: candidate.name, percentage };
  });

  const toggleShowAll = () => {
    setShowAllOptions(!showAllOptions);
  };


  const handleDeletePoll = async (pollId: string) => {
    try {
      const response = await fetch(`/api/delete-poll/${pollId}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete poll');
      }
      
      onPollDeleted(pollId);
    } catch (err) {
      console.error('Error deleting poll:', err);
    }
  };

  return (
    <div className="bg-white border-2 border-black rounded-lg p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
      <div className="flex flex-col space-y-3">
        {/* Title Section */}
        <h2 className="text-3xl font-black text-gray-900 ">{poll.poll_title}</h2>


        {/* Creator and Time */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <Users className="w-4 h-4 mr-1.5 text-blue-500" />
            <span className="font-medium hidden sm:flex">by {poll.creator_wallet_key}</span>
            <span className="font-medium flex sm:hidden">by {`${poll.creator_wallet_key.slice(0, 4)}...${poll.creator_wallet_key.slice(-3)}`}</span>

          </div>
          <div className="flex items-center bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            <Clock className="w-4 h-4 mr-1.5 text-purple-500" />
            <span>{timeLeft}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 my-4">
        {visibleOptions.map((candidate) => (
          <div key={candidate.id} className="relative group">
            <div className="h-10 bg-gray-100 rounded-md overflow-hidden">
              <div
                className={`h-full ${getOptionColor(candidate.percentage)} transition-all duration-500 ease-out`}
                style={{ width: `${candidate.percentage}%` }}
              />
            </div>
            <div className="absolute inset-0 flex items-center px-3">
              <span className="font-medium text-sm sm:text-base text-white mix-blend-difference">
                {candidate.name}
              </span>
              <span className="ml-auto font-bold text-sm bg-white/90 px-2 py-0.5 rounded">
                {candidate.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {hasMoreOptions && (
        <button
          onClick={toggleShowAll}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-1"
        >
          {showAllOptions ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show {poll.candidates.length - maxVisibleOptions} more options
            </>
          )}
        </button>
      )}

      <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-gray-200">
        <div className="text-sm text-gray-600">
          {totalVotes} votes • Created {new Date(poll.created_at).toLocaleDateString()}
        </div>

        <Link
          href={`/poll/${poll.poll_id}`}
          className="flex items-center px-4 py-2 bg-black text-white font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-800 transition-all hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          {poll.userVoted || poll.poll_end < Date.now() ? 'View Results' : 'Vote'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>



        {poll.creator_wallet_key === wallet.publicKey?.toBase58() && (
          <button
            onClick={()=> handleDeletePoll(poll.poll_id)}
            className="ml-3 flex items-center px-4 py-2 bg-red-600 text-white font-bold rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700 transition-all hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            Delete 
          </button>)
        }
      </div>
    </div>
  );
};

export default PollCard;
