use anchor_lang::prelude::*;
pub mod states;
pub mod handlers;
pub mod errors;

pub use states::*;
use handlers::poll_handler::*;
use handlers::candidate_handler::*;
use handlers::vote_handler::*;
declare_id!("CahoJqP45XiXju2xgj5nCKHEhbYJJmCU19X78sfpJEhr");

#[program]
pub mod booth {
    use super::*;

    pub fn initialize_poll(
        ctx:Context<InitializePoll>,
        poll_id: u128,
        description:String,
        poll_start:u64,
        poll_end: u64
    )-> Result<()>{
        handle_poll_intialization(ctx, poll_id, description, poll_start, poll_end)
    }

    pub fn initialize_candidate(
        ctx: Context<InitializeCandidate>,
        candidate_name:String,
        poll_id:u128
    )->Result<()> {
       handle_candidate_initialization(ctx, candidate_name, poll_id)
    }

    pub fn vote(
        ctx: Context<Vote>,
        candidate_name: String,
        poll_id: u128
    )-> Result<()> {
        handle_vote(ctx, candidate_name, poll_id)
    }
}
