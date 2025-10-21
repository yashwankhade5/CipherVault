use crate::state::{multisig::*, transaction::*};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct ApprovalContext<'info> {
    #[account(mut)]
    pub approver: Signer<'info>,

    pub multisig: Account<'info, Multisig>,

    #[account(mut)]
    pub transaction: Account<'info, TransactionAccount>,
}
