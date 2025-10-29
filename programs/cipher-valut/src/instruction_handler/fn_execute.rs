use crate::state::{multisig::Multisig, transaction::*};
use crate::MyError;
use anchor_lang::prelude::*;

pub fn transaction_execute(ctx: Context<TransactionExecuteContext>) -> Result<()> {
    let clock = Clock::get()?;
    let reciepient_account = &ctx.accounts.reciepient_account;
    let transaction_account = &ctx.accounts.transaction_account;
    let multisig_account = &ctx.accounts.multisig;
    let vault_account = &ctx.accounts.vault;
    let approval_count = transaction_account
        .approval
        .iter()
        .filter(|&&approved| approved == true)
        .count();
    let Enoughsol = transaction_account.amount.checked_add(1).ok_or(MyError::Overflow)?;;
    require!(
        multisig_account.threshold <= approval_count as u8,
        MyError::NotEnoughApproval
    );
    require!(vault_account.lamports() > Enoughsol ,MyError::NotEnoughSol);

    if 0 < transaction_account.amount {
        vault_account.sub_lamports(ctx.accounts.transaction_account.amount)?;
        reciepient_account.add_lamports(ctx.accounts.transaction_account.amount)?;
      
         ctx.accounts.multisig.tx_pending = ctx.accounts.multisig.tx_pending.checked_sub(1).ok_or(MyError::Underflow)?;
         
    }

    if 0<transaction_account.spl_token.amount{



    }
      ctx.accounts.transaction_account.executed = true;
      ctx.accounts.transaction_account.executed_at= clock.unix_timestamp;

    Ok(())
}

#[derive(Accounts)]
pub struct TransactionExecuteContext<'info> {
    #[account(mut)]
    pub multisig: Account<'info, Multisig>,
    #[account(mut)]
    pub signer: Signer<'info>,
#[account(mut)]
    pub transaction_account: Account<'info, TransactionAccount>,

    #[account(mut)]
    /// CHECK: this sol vault not dataccount
    pub vault: AccountInfo<'info>,
    
 #[account(mut)]
    /// CHECK: this sol vault not dataccount
    pub reciepient_account: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}
