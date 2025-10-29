use crate::state::multisig::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(AnchorDeserialize, AnchorSerialize, Clone, Default)]
pub struct SplTokenData {
    pub mint: Pubkey,
    pub amount: u64,
}

#[account]
pub struct TransactionAccount {
    pub multisig: Pubkey,
    pub valut: Pubkey,
    pub amount: u64,
    pub approval: Vec<bool>,
    pub spl_token: SplTokenData,
    pub executed: bool,
    pub reciepient: Pubkey,
    pub proposer: Pubkey,
    pub date: i64,
    pub executed_at: i64,
}

#[derive(Accounts)]
pub struct TransactionContext<'info> {
    #[account(mut)]
    pub multisig: Account<'info, Multisig>,

    #[account(mut)]
    pub proposer: Signer<'info>,
    #[account(init,
        payer=proposer,
     space = 8 +
            32 + // multisig pubkey
            32 + // vault pubkey
            8 +  // amount
            4 + (multisig.owners.len() * 1) + // approval vec
            (32 + 8) + // spl_token data (mint + amount)
            1 + // executed bool
            32 + // recipient
            32 + // proposer
            8 +  // date
            8,   // executed_at
        seeds = [b"transaction",multisig.key().as_ref(),&multisig.transaction_count.to_le_bytes()],
        bump
    )]
    pub transaction_account: Account<'info, TransactionAccount>,

    /// CHECK: it is for transfer and this account can be created by anchor,native or system program so that is why accountinfo
    pub reciepient: AccountInfo<'info>,

    /// CHECK: vault storing sol not a dataccount
    pub vault: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}
