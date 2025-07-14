export type PollOption = {
  id: string;
  text: string;
  votes: number;
  percentage: number;
};

export type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  timeLeft: string;
  userVoted: boolean;
  createdAt: string;
  creator: string;
};
