use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::{invoke};
use anchor_lang::solana_program::instruction::{Instruction};

use wormhole_anchor_sdk::wormhole::Instruction::PostMessage;
use wormhole_anchor_sdk::*;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("FCfcutChmLTZjb7gKpfBqwPSdxi4NCs71bnVqiMuY9dp");

#[program]
mod helloworm {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, _data: Vec<u8>) -> Result<()> {

        let core_bridge = &mut ctx.accounts.core_bridge;

        let mut account_1 = ctx.accounts.message.to_account_metas(Some(true)); // signer
        let mut account_2: Vec<AccountMeta> = ctx.accounts.emitter.to_account_metas(None);
        let mut account_3 = ctx.accounts.sequence.to_account_metas(None);
        let mut account_4 = ctx.accounts.payer.to_account_metas(Some(true)); // signer
        let mut account_5 = ctx.accounts.fee_collector.to_account_metas(None);
        let mut account_6 = ctx.accounts.clock.to_account_metas(None);
        let mut account_7 = ctx.accounts.rent.to_account_metas(None);
        let mut account_8 = ctx.accounts.system_program.to_account_metas(None);
        let mut account_9 = ctx.accounts.bridge.to_account_metas(None);
        
        account_1.append(&mut account_2);
        account_1.append(&mut account_3);
        account_1.append(&mut account_4);
        account_1.append(&mut account_5);
        account_1.append(&mut account_6);
        account_1.append(&mut account_7);
        account_1.append(&mut account_8);
        account_1.append(&mut account_9);

        let ins = Instruction {
                program_id: core_bridge.key(),
                accounts: account_1,
                data: PostMessage { batch_id: (0), payload: (vec![1]), finality: (wormhole::Finality::Finalized) }.try_to_vec()?,
            };
        
        
        // invoke(
        //     &ins,
        //     &[ctx.accounts.message.to_account_info(), ctx.accounts.emitter.to_account_info(), ctx.accounts.sequence.to_account_info(), 
        //       ctx.accounts.payer.to_account_info(), ctx.accounts.fee_collector.to_account_info(), ctx.accounts.clock.to_account_info(), 
        //       ctx.accounts.system_program.to_account_info(), ctx.accounts.rent.to_account_info(), ctx.accounts.bridge.to_account_info()].as_ref(),
        // )?;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub core_bridge: UncheckedAccount<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub bridge: AccountInfo<'info>,
    #[account(mut)]
    pub message: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(
        init_if_needed,
        seeds = [b"emitter"],
        bump,
        payer = payer,
        space = 16,
    )]
    pub emitter: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub sequence: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub fee_collector: AccountInfo<'info>,
    pub clock: Sysvar<'info, Clock>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}