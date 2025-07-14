// candidate account schema
use anchor_lang::prelude::*;
#[account]
#[derive(InitSpace)]
pub struct Candidate{
        #[max_len(32)]
        pub candidate_name: String, 
        pub candidate_votes:u64,
}




//  account schema for the Poll account
#[account]
#[derive(InitSpace)] 
pub struct Poll {
    pub poll_id : u128,
    #[max_len(280)]
    pub description : String,
    pub poll_start: u64,
    pub poll_end : u64,
    pub candidate_amount : u64
}


// voter account 
#[account]
#[derive(InitSpace)]
pub struct Voter {
    pub has_voted: bool,
}