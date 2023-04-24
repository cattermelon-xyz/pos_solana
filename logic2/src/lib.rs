use solana_program::{
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
    account_info::AccountInfo,
    program::set_return_data,
};


entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult{
    msg!("instruction_data: {:?}", &instruction_data);

    set_return_data(&instruction_data);

    msg!("Invoke success");

    msg!("hello hello");

    Ok(())
}