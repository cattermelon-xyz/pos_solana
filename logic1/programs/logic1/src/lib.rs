use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::set_return_data;

declare_id!("AnnhVcf5pEvuckMyQ2fwSDSCvH6mD2ehAE6hG8kCuZ9y");

#[program]
mod logic1 {
    use super::*;

    pub fn vote(ctx: Context<VoteParams>, option: u8) -> Result<()> {
        set_return_data(&[option]);

        msg!("Option: {}", option);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct VoteParams<'info> {
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub owner: AccountInfo<'info>,
}
