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
    // pub spl_token:SplTokenData,
    pub executed: bool,
    pub reciepient: Pubkey,
    pub proposer: Pubkey,
    pub date: i64,
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
        32+
        32+ //multisig pubkey
        8+//sol amount
        4+(multisig.owners.len()*1)+ // max size for vec
        32+ //proposer pubkey
        1+ //executed bool
        32+
        8, // reciepient
        seeds = [b"transaction",multisig.creator.key().as_ref()],
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
