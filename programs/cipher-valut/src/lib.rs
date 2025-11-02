use anchor_lang::prelude::*;
pub mod instruction_handler;
pub mod state;
use crate::instruction_handler::*;
use crate::state::{approval::*, multisig::*, transaction::*, SplTokenData};

declare_id!("GE7BKNYicWuTHVxWfTTBg8LZJSjURtWta9PgrvmrYkjj");

#[program]
pub mod cipher_valut {
    use crate::instruction_handler::create_transaction::create_transaction_handler;

    use super::*;

    pub fn create_multisig(
        ctx: Context<Initialize>,
        threshold: u8,
        owners: Vec<Pubkey>,
        name: String,
        amount: Option<u64>
    ) -> Result<()> {
        create_multisig_handler(ctx, threshold, owners, name,amount)
    }

    pub fn create_transaction(
        ctx: Context<TransactionContext>,
        amount: Option<u64>,
        spl_token: Option<SplTokenData>,
    ) -> Result<()> {
        create_transaction_handler(ctx, amount, spl_token)
    }

    pub fn approval(ctx: Context<ApprovalContext>) -> Result<()> {
        approval_handler(ctx)
    }

    pub fn fn_execute(ctx: Context<TransactionExecuteContext>) -> Result<()> {
        transaction_execute(ctx)
    }
}

#[error_code]
pub enum MyError {
    #[msg("Invalid owner tried to approve")]
    InvalidOwnerError,
    #[msg("not enough approvals")]
    NotEnoughApproval,
    #[msg("reciepient account not recieved")]
    ReciepientAccountNotReceived,
    #[msg("propser not in onwers")]
    ProposeNotinOwners,
    #[msg("not enough sol in vault")]
    NotEnoughSol,
    #[msg("overflow count")]
    Overflow,
    
    #[msg("Underflow count")]
    Underflow,
    #[msg("duplicate owners")]
    DuplicateOwners,
}
