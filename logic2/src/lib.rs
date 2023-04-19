use solana_program::{
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
    account_info::{next_account_info, AccountInfo},
    program_error::ProgramError,
};

pub mod instruction;
use instruction::WorkflowInstruction;

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult{
   let instruction = WorkflowInstruction::unpack(instruction_data)?;
   match instruction {
         WorkflowInstruction::CalculateNumbers{number1, number2} => {
              msg!("CalculateNumbers");
              calculate_numbers(program_id, accounts, number1, number2)
         }
   }
}

pub fn calculate_numbers(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    number1: u8,
    number2: u8
) -> ProgramResult {
    let total = number1 + number2;
    msg!("Total: {:#?}", &total);
    set_return_data(&[total]);

    Ok(())
}