import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { getBoothProgram, getBoothProgramId } from "@/utils/anchor";
import { useNetwork } from "@/contexts/Wallet-Provider";
import { AnchorProvider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Check } from "lucide-react";
import { Candidate } from "@/app/poll/[pollId]/page";

interface VotingOptionsProps {
  candidates: Candidate[];
  selectedCandidate: Candidate | null;
  onSelect: (candidate: Candidate) => void;
  showResults?: boolean;
}

function VotingOptionsComponent({
  candidates,
  selectedCandidate,
  onSelect,
  showResults = false,
}: VotingOptionsProps) {
  const wallet: any = useWallet();
  const { connection } = useConnection();

  const provider = useMemo(()=>{
    return new AnchorProvider(connection, wallet, {});
   }, [connection, wallet]);
   const { network } = useNetwork();
   const program = useMemo(() =>
    getBoothProgram(provider)
  , [provider]);
  const programId = useMemo(() => getBoothProgramId(network), [network]);

  const [liveVotes, setLiveVotes] = useState<{ [key: string]: number }>({});

  const fetchCandidateVotes = useCallback(async () => {
    if (!program || candidates.length === 0) return;

    try {
      const votesMap: { [key: string]: number } = {};

      await Promise.all(
        candidates.map(async (candidate) => {
          try {
            if (!candidate.poll_id) {
              console.error('Missing poll_id for candidate:', candidate.id);
              return;
            }
            if (!candidate.name) {
              console.error('Missing name for candidate:', candidate.id);
              return;
            }
            
            const pollIdBuffer = Buffer.from(candidate.poll_id, 'hex');
            const [candidatePDA] = PublicKey.findProgramAddressSync(
              [pollIdBuffer, Buffer.from(candidate.name)],
              program.programId
            );

            const candidateAccount = await program.account.candidate.fetch(candidatePDA);
            console.log("candidateAccount for", candidate.name, ":", candidateAccount);
            votesMap[candidate.id] = candidateAccount.candidateVotes.toNumber();
          } catch (err) {
            console.error("Failed to fetch candidate votes for", candidate.name || candidate.id, err);
          }
        })
      );

      if (Object.keys(votesMap).length > 0) {
        setLiveVotes(prevVotes => ({
          ...prevVotes,
          ...votesMap
        }));
      }
    } catch (error) {
      console.error("Error in fetchCandidateVotes:", error);
    }
  }, [program, candidates]);

  useEffect(() => {
    if (!program || candidates.length === 0) return;

    let isMounted = true;
    const POLLING_INTERVAL = 50000;

    // Initial fetch
    fetchCandidateVotes();

    // Set up polling
    const intervalId = setInterval(fetchCandidateVotes, POLLING_INTERVAL);

    // Cleanup
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [fetchCandidateVotes, program, candidates]);

  const totalVotes = useMemo(() =>
    Object.values(liveVotes).reduce((acc, cur) => acc + cur, 0),
    [liveVotes]
  );

  return (
    <div className="space-y-3">
      {candidates.map((candidate) => {
        const votes = liveVotes[candidate.id] || 0;
        const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
        const isSelected = selectedCandidate?.id === candidate.id;

        return (
          <div
            key={candidate.id}
            className={`relative p-4 border-2 border-black rounded-lg cursor-pointer transition-all ${
              isSelected ? 'bg-yellow-100' : 'bg-white hover:bg-gray-50'
            }`}
            onClick={() => onSelect(candidate)}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{candidate.name}</span>
              {isSelected && <Check className="w-5 h-5 text-green-600" />}
            </div>

            {showResults && (
              <div className="mt-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>{votes} votes</span>
                  <span>{percentage}%</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export const VotingOptions = memo(VotingOptionsComponent);
