use borsh::{BorshDeserialize};
use solana_program::{program_error::ProgramError};

pub enum WorkflowInstruction{
    CalculateNumbers{
        number1: u8,
        number2: u8,
    }
}

#[derive(BorshDeserialize)]
struct WorkflowPayload {
    number1: u8,
    number2: u8,
}

impl WorkflowInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&variant, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
        let payload = WorkflowPayload::try_from_slice(rest).unwrap();
        Ok(match variant {
            0 => Self::CalculateNumbers{
                number1: payload.number1,
                number2: payload.number2,
            },
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }
}