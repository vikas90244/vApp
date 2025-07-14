import { Loader2 } from 'lucide-react';

interface VoteButtonProps {
  isSubmitting?: boolean;
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function VoteButton({ 
  isSubmitting = false, 
  isSelected, 
  onClick, 
  children 
}: VoteButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={!isSelected || isSubmitting}
      className={`w-full py-3 px-6 rounded-md font-bold text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
        isSelected 
          ? isSubmitting
            ? 'bg-yellow-300 cursor-wait'
            : 'bg-green-400 hover:bg-green-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
          : 'bg-gray-200 cursor-not-allowed opacity-70'
      }`}
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center">
          <Loader2 className="animate-spin h-5 w-5 mr-2" />
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
