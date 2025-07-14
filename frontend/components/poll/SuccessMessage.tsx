import { Check, BarChart2 } from 'lucide-react';

export function SuccessMessage() {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex">
          <div className="flex-shrink-0">
            <Check className="h-5 w-5 text-green-700" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              Your vote has been recorded! Thanks for participating.
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center py-4 bg-white rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <BarChart2 className="w-5 h-5" />
          <span className="font-medium">Poll results are being updated in real-time</span>
        </div>
      </div>
    </div>
  );
}
