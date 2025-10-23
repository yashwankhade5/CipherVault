use crate::state::transaction::{SplTokenData, *};
use anchor_lang::prelude::*;

#[account]
pub struct Multisig {
    pub creator: Pubkey,
    pub owners: Box<Vec<Pubkey>>,
    pub spl_token: Box<Vec<SplTokenData>>,
    pub threshold: u8,
    pub transaction_count: u32,
    pub name: String,
    pub vaultbump: u8,
    pub tx_pending:u16,
}

#[derive(Accounts)]
#[instruction(threshold:u8,owners:Vec<Pubkey>,name:String)]
pub struct Initialize<'info> {
    #[account(init,payer=creator,
        space=8+
        8+   //
        60+   //max owners size = 15
        1200+  // max no of tokens hold = 1000
        64+   // sol amount
        4+//creator:pubkey
       2,
        seeds=[b"multisig",creator.key().as_ref(),name.as_ref()],
        bump
    )]
    pub multi_sig: Account<'info, Multisig>,

    #[account(init,
        payer=creator,
        space=0,
        seeds=[b"vault",multi_sig.key().as_ref()],
    bump)]
    /// CHECK: vault storing sol not a dataccount
    pub vault: AccountInfo<'info>,

    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}
