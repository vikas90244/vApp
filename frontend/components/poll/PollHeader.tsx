import Link from 'next/link';
import { ArrowLeft, Share2, Check, BarChart2, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PollHeaderProps {
  question: string;
  totalVotes: number;
  timeLeft: string;
  creator: string;
  onShare: () => void;
  isCopied: boolean;
}

export function PollHeader({
  question,
  totalVotes,
  timeLeft,
  creator,
  onShare,
  isCopied,
}: PollHeaderProps) {
  return (
    <div className="mb-8">
      <Link 
        href="/explore" 
        className="inline-flex items-center text-blue-600 hover:underline mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
        Back to all polls
      </Link>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-4xl font-black text-black bg-yellow-300 px-4 py-2 rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {question}
        </h1>
        <button 
          onClick={onShare}
          className={cn(
            'flex items-center px-4 py-2 font-bold rounded-md border-2 border-black',
            'shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]',
            isCopied ? 'bg-green-300' : 'bg-white hover:bg-gray-50'
          )}
          title="Copy link to clipboard"
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 mr-1 text-green-700" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 mr-1" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 bg-white p-3 rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full border border-black">
          <BarChart2 className="w-4 h-4 mr-1" />
          <span className="font-medium">{totalVotes} votes</span>
        </div>
        <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full border border-black">
          <Clock className="w-4 h-4 mr-1" />
          <span className="font-medium">Ends in {timeLeft}</span>
        </div>
        <div className="flex items-center bg-pink-100 px-3 py-1 rounded-full border border-black">
          <Users className="w-4 h-4 mr-1" />
          <span className="font-medium">By {creator}</span>
        </div>
      </div>
    </div>
  );
}
