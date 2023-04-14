use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::{invoke, get_return_data};
use anchor_lang::solana_program::instruction::{Instruction, AccountMeta};
use anchor_lang::solana_program::pubkey::Pubkey;
use borsh::{BorshDeserialize, BorshSerialize};

declare_id!("ENHr4cF54EwYtc1NtfWAfmqexcDXZTxjizuXg6UPpUXv");

#[program]
// Smart contract functions
pub mod workflow {
    use super::*;

    pub fn init_user(ctx: Context<InitUserParams>) -> Result<()> {
        msg!("Init   User!!");

        // The creation of the counter must be here
        let user_info = &mut ctx.accounts.user_info;
        user_info.max = 0;
        msg!("For {}, user_info PDA: {} ",ctx.accounts.owner.key(), user_info.key());
        Ok(())
    }

    pub fn create_workflow(ctx: Context<CreateWorkflowParams>) -> Result<()> {

        let aworkflow = &mut ctx.accounts.aworkflow;
        aworkflow.ping = 0;

        let user_info = &mut ctx.accounts.user_info;
        user_info.max += 1;
        
        Ok(())
    }
    

    pub fn vote(ctx: Context<VoteParams>, option: Vec<u8>) -> Result<()>{

        // let payload = OptionPayload::try_from_slice(&option).unwrap();
        // msg!("Option: {:#?}", &payload);

        // let serialized_payload = payload.try_to_vec().unwrap();
        // msg!("Option: {:#?}", serialized_payload);

        let owner = &mut ctx.accounts.owner;
        let aworkflow = &mut ctx.accounts.aworkflow;
        let program_account = &ctx.accounts.program_account;
        
        let accounts = vec![
            owner.to_account_info().clone(),
            program_account.to_account_info().clone(),
        ];
        
        // Logic: 346M6ij5cXBqdVLwoHaqnGqymQKcMh8dnzi8zso1wfRm
        // Workflow: 48hv9JnQhskRVGJAouRwev7DrgKTPtirfzXBGaqmo6CH
        let mut accounts_1 = ctx.accounts.owner.to_account_metas(None);
        let mut accounts_2 = ctx.accounts.program_account.to_account_metas(None);

        let instruction_id: [u8; 8] = [227, 110, 155, 23, 136, 126, 172, 25];
        // let data_value = vec![option]; // Giá trị dữ liệu đầu vào
        let mut data = instruction_id.to_vec();
        data.extend(option);
        
        accounts_1.append(&mut accounts_2);
        let ins = Instruction{
               program_id: program_account.key(),
                accounts: accounts_1,
                data: data,
            };
        
        invoke(
            &ins,
            [ctx.accounts.owner.to_account_info()].as_ref(),
        )?;
        
        // let result_data = get_return_data();
        aworkflow.ping += 1;
        // msg!("Result: {:?}", result_data.unwrap());
        
        Ok(())
    }
}

// #[derive(Debug,BorshDeserialize, BorshSerialize)]
// pub struct OptionPayload {
//     pub number1: u8,
//     pub number2: u8
// }


#[derive(Accounts)]
// #[instruction(option: u8)]
pub struct VoteParams<'info> {
    #[account(mut)]
     /// CHECK: This is not dangerous because we don't read or write from this account
    pub owner: AccountInfo<'info>,
    #[account(mut)]
    pub aworkflow: Account<'info, Workflow>,
     /// CHECK: This is not dangerous because we don't read or write from this account
    pub program_account: AccountInfo<'info>,
}

// // Data structures
// #[account]
// pub struct VoteInfo {
//     vote_machine_address: Pubkey,
//     option: u8,
// }

// #[account]
// pub struct VoteData {
//     option: u8,
// }
// Data validators
#[account]
pub struct Workflow {
    ping: u8,
}

#[derive(Accounts)]
pub struct InitUserParams<'info> {
    #[account(mut)]
    owner: Signer<'info>,
    #[account(
        init,
        seeds = [owner.key().as_ref()],
        bump,
        payer = owner,
        space = 8+1
    )]
    user_info: Account<'info, UserInfo>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateWorkflowParams<'info> {
    #[account(mut)]
    owner: Signer<'info>,
    #[account(mut)]
    user_info: Account<'info, UserInfo>,
    #[account(
        init,
        seeds = [owner.key().as_ref(), &[user_info.max]],
        bump,
        payer = owner,
        space = 8+1
    )]
    aworkflow: Account<'info, Workflow>,
    system_program: Program<'info, System>,
}

// Data structures
#[account]
pub struct UserInfo {
    max: u8,
}