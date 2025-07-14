use anchor_lang::prelude::*;
use crate::states::*;

pub fn handle_candidate_initialization(
               ctx: Context<InitializeCandidate>,
               candidate_name:String,
               _poll_id:u128
           )-> Result<()> {

           let candidate = &mut ctx.accounts.candidate;
           let poll = &mut ctx.accounts.poll;
           poll.candidate_amount += 1 ;
           candidate.candidate_name  = candidate_name;
           candidate.candidate_votes = 0;

       Ok(())
   }


   // context for the intialize_candidate function
   #[derive(Accounts)]
   #[instruction(candidate_name:String, poll_id:u128)]
   pub struct InitializeCandidate<'info>{
       #[account(mut)]
       pub signer: Signer<'info>,

       #[account(
           mut,
           seeds = [poll_id.to_le_bytes().as_ref()],
           bump
       )]
       pub poll: Account<'info ,Poll>,

       #[account(
           init,
           payer=signer,
           space = 8 + Candidate::INIT_SPACE,
           seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_bytes()],
           bump,

       )]
       pub candidate: Account<'info, Candidate>,
       pub system_program: Program<'info, System>,
   }
