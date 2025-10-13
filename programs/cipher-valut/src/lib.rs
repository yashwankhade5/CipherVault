pub mod state;
use crate::state::{multisig::*, transaction::*, SplTokenData};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
pub mod instruction_handler;
use crate::instruction_handler::*;

declare_id!("DwNor5AYxg3s7gckBr1Q3YRf2fLPbEjk8Fz11oYKwUas");

#[program]
pub mod cipher_valut {

    use super::*;

    pub fn create_multisig(
        ctx: Context<Initialize>,
        threshold: u8,
        owners: Vec<Pubkey>,
        name: String,
    ) -> Result<()> {
        ctx.accounts.multisig.creator = ctx.accounts.creator.key();
        ctx.accounts.multisig.owners = Box::new(owners);
        ctx.accounts.multisig.threshold = threshold;
        ctx.accounts.multisig.name = name;
        Ok(())
    }

    pub fn create_transaction(
        ctx: Context<TransactionContext>,
        amount: Option<u64>,
        spl_token: Option<SplTokenData>,
    ) -> Result<()> {
        let clock = Clock::get()?;
        ctx.accounts.transaction_account.multisig = ctx.accounts.multisig.key();
        ctx.accounts.transaction_account.amount = amount.unwrap_or(0);
        ctx.accounts.transaction_account.spl_token = spl_token.unwrap_or_default();
        ctx.accounts.transaction_account.approval = vec![false; ctx.accounts.multisig.owners.len()];
        ctx.accounts.transaction_account.proposer = ctx.accounts.proposer.key();
        ctx.accounts.transaction_account.executed = false;
        ctx.accounts.transaction_account.date = clock.unix_timestamp;

        Ok(())
    }

    pub fn approval(ctx: Context<ApprovalContext>) -> Result<()> {
        let owner_index = ctx
            .accounts
            .multisig
            .owners
            .iter()
            .position(|&owner| owner == ctx.accounts.approver.key());
        let approval_vec = &mut ctx.accounts.transaction.approval;
        let threshold = ctx.accounts.multisig.threshold;
        if let Some(position) = owner_index {
            approval_vec[position] = true;
            let num_approval = approval_vec
                .iter()
                .filter(|&&approve_val| approve_val == true)
                .count();
            if num_approval >= threshold.into() {}
        } else {
            return err!(MyError::InvalidOwnerError);
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(init,payer=creator,
        space=8+
        8+   //
        60+   //max owners size = 15
        12000+  // max no of tokens hold = 1000
        64+   // sol amount
        4,//creator:pubkey
        seeds=[b"multisig",creator.key().as_ref()],
        bump
    )]
    pub multisig: Account<'info, Multisig>,

    #[account(init,
        payer=creator,
        space=0,
        seeds=[b"multisig",multisig.key().as_ref()],
    bump)]
    pub vault: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransactionContext<'info> {
    #[account(mut)]
    pub multisig: Account<'info, Multisig>,

    #[account(mut)]
    pub proposer: Signer<'info>,
    #[account(init,
        payer=proposer,
        space=8+
        32+ //multisig pubkey
        8+//sol amount
        2+ // max size for vec
        32+ //mint address
        8+ // token amount
        32+ //proposer pubkey
        1+ //executed bool
        32, // reciepient
        seeds = [b"transaction",multisig.creator.key().as_ref(),&multisig.transaction_count.to_le_bytes()],
        bump
    )]
    pub transaction_account: Account<'info, TransactionAccount>,

    /// CHECK: it is for transfer and this account can be created by anchor,native or system program so that is why accountinfo
    pub reciepient: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ApprovalContext<'info> {
    #[account(mut)]
    pub approver: Signer<'info>,

    pub multisig: Account<'info, Multisig>,

    pub transaction: Account<'info, TransactionAccount>,
}

#[error_code]
pub enum MyError {
    #[msg("Invalid owner tried to approve")]
    InvalidOwnerError,
    #[msg("not enough approvals")]
    NotEnoughApproval,
}
