//  error codes for the vote
use anchor_lang::prelude::*;

#[error_code]
pub enum BoothErrorCode {
    #[msg("Poll has not started yet.")]
    PollNotStarted,
    #[msg("Poll has already ended.")]
    PollEnded,
    #[msg("You have already voted.")]
    AlreadyVoted,
}
