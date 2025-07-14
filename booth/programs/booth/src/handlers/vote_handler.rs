use anchor_lang::prelude::*;
use crate::errors::BoothErrorCode;
use crate::states::*;

pub fn handle_vote(
        ctx: Context<Vote>,
        _candidate_name: String,
        _poll_id: u128
    ) -> Result<()> {
        let poll = & ctx.accounts.poll;
        let voter = &mut ctx.accounts.voter;
        let candidate = &mut ctx.accounts.candidate;

        let clock = Clock::get()?;
        let now = clock.unix_timestamp as u64;
        require!(now >= poll.poll_start, BoothErrorCode::PollNotStarted);
        require!(now <= poll.poll_end, BoothErrorCode::PollEnded);
        require!(!voter.has_voted, BoothErrorCode::AlreadyVoted);

        candidate.candidate_votes += 1;
        voter.has_voted = true;

        msg!("Votes : {}", candidate.candidate_votes);
        Ok(())
}



// context for the vote function

#[derive(Accounts)]
#[instruction(candidate_name:String, poll_id:u128)]
pub struct Vote<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump
    )]
    pub poll: Account<'info, Poll>,
     #[account(
        mut,
        seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_bytes()],
        bump
    )]
    pub candidate: Account<'info, Candidate>,
    #[account(
        init,
        payer = signer,
        space = 8 + Voter::INIT_SPACE,
        seeds = [poll_id.to_le_bytes().as_ref(), signer.key().as_ref()],
        bump
    )]
    pub voter : Account<'info, Voter>,
    pub system_program: Program<'info, System>
}
