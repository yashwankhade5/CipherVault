use anchor_lang::prelude::*;
use crate::state::{multisig::Multisig,transaction::*};
use crate::{MyError};

pub fn transaction_execute(ctx:Context<TransactionExecuteContext>)->Result<()>{
let sol_amount = ctx.accounts.transaction_account.amount;
let spl_token = &mut ctx.accounts.transaction_account.spl_token.amount;
let threshold = ctx.accounts.multisig.threshold;
let approvals  = &mut ctx.accounts.transaction_account.approval;
let approval_count = approvals.iter().filter(|&&a| a== true).count() as u8;
require!(threshold>approval_count,MyError::NotEnoughApproval);

if sol_amount>0{

}

    Ok(())
}


#[derive(Accounts)]
pub struct TransactionExecuteContext<'info>{
    #[account(mut)]
    pub multisig: Account<'info,Multisig>,
    pub transaction_account:Account<'info,TransactionAccount>,
    pub Vault:AccountInfo<'info>,
    pub system_program:Program<'info,System>
}