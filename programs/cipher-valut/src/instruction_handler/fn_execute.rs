use crate::state::{multisig::Multisig, transaction::*};
use crate::MyError;
use anchor_lang::prelude::*;

pub fn transaction_execute(ctx: Context<TransactionExecuteContext>) -> Result<()> {
    let reciepient_account = &ctx.accounts.reciepient_account;
    let transaction_account = &ctx.accounts.transaction_account;
    let multisig_account = &ctx.accounts.multisig;
    let vault_account = &ctx.accounts.vault;
    let approval_count = transaction_account
        .approval
        .iter()
        .filter(|&&approved| approved == true)
        .count();
    require!(
        multisig_account.threshold <= approval_count as u8,
        MyError::NotEnoughApproval
    );

    if 0 < transaction_account.amount {
        vault_account.sub_lamports(ctx.accounts.transaction_account.amount)?;
        reciepient_account.add_lamports(ctx.accounts.transaction_account.amount)?;
    }

    Ok(())
}

#[derive(Accounts)]
pub struct TransactionExecuteContext<'info> {
    pub multisig: Account<'info, Multisig>,
    #[account(mut)]
    pub signer: Signer<'info>,

    pub transaction_account: Account<'info, TransactionAccount>,

    #[account(mut)]
    /// CHECK: this sol vault not dataccount
    pub vault: AccountInfo<'info>,

    /// CHECK: this sol vault not dataccount
    pub reciepient_account: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}
