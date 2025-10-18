use anchor_lang::prelude::*;
use  crate::state::{Initialize};

pub fn create_multisig_handler(ctx:Context<Initialize>,threshold:u8,owners:Vec<Pubkey>,name:String)->Result<()>{

     ctx.accounts.multi_sig.creator = ctx.accounts.creator.key();
        ctx.accounts.multi_sig.owners = Box::new(owners);
        ctx.accounts.multi_sig.threshold = threshold;
        ctx.accounts.multi_sig.name = name;
        ctx.accounts.multi_sig.vaultbump=ctx.bumps.vault;
        Ok(())
}