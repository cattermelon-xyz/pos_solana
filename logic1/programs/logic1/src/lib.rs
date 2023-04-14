use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::set_return_data;
use borsh::{BorshDeserialize, BorshSerialize};

declare_id!("AnnhVcf5pEvuckMyQ2fwSDSCvH6mD2ehAE6hG8kCuZ9y");

#[program]
mod logic1 {
    use super::*;

    pub fn vote(ctx: Context<VoteParams>, option: Vec<u8>) -> Result<()> {
 
        // let payload = OptionPayload::try_from_slice(&option).unwrap();
        msg!("Option: {:#?}", &option);
        //Finish for me
        // let serialized_payload = payload.try_to_vec().unwrap();

        // msg!("Option: {:#?}", &serialized_payload);
        // set_return_data(&instruction);

        // set_return_data(&serialized_payload);

        Ok(())
    }
}


// #[derive(Debug,BorshDeserialize, BorshSerialize)]
// pub struct OptionPayload {
//     pub number1: u8,
//     pub number2: u8
// }

#[derive(Accounts)]
pub struct VoteParams<'info> {
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub owner: AccountInfo<'info>,
}