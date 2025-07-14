use anchor_lang::prelude::*;
use crate::states::*;


pub fn handle_poll_intialization(ctx: Context<InitializePoll>,
                poll_id: u128,
                description:String,
                poll_start:u64,
                poll_end: u64
    ) -> Result<()> {
        let poll = &mut ctx.accounts.poll;
        poll.poll_id = poll_id;
        poll.description = description;
        poll.poll_start = poll_start;
        poll.poll_end = poll_end;
        poll.candidate_amount = 0;
        Ok(())
    }
    // context account schema for the initialize_poll

    #[derive(Accounts)]
    #[instruction(poll_id:u128)]

    pub struct InitializePoll<'info> {
    #[account(mut)]
    pub signer :Signer<'info>,

    #[account(
        init,
        payer=signer,
        space = 8 + Poll::INIT_SPACE,
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump,

    )]
    pub poll: Account<'info ,Poll>,
    pub system_program: Program<'info, System>,
    }
