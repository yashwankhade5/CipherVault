use crate::state::Initialize;
use anchor_lang::{prelude::*, solana_program::{program::invoke, system_instruction}};
use crate::MyError;

pub fn create_multisig_handler(
    ctx: Context<Initialize>,
    threshold: u8,
    owners: Vec<Pubkey>,
    name: String,
    amount:Option<u64>
) -> Result<()> {
    for (i,owner) in owners.iter().enumerate(){
        require!(!owners[i+1..].contains(owner),MyError::DuplicateOwners)
    }
    ctx.accounts.multi_sig.creator = ctx.accounts.creator.key();
    ctx.accounts.multi_sig.owners = Box::new(owners);
    ctx.accounts.multi_sig.threshold = threshold;
    ctx.accounts.multi_sig.name = name;
    ctx.accounts.multi_sig.vault = ctx.accounts.vault.key();
    let amount = amount.unwrap_or(0);

let ix =  system_instruction::transfer(&ctx.accounts.multi_sig.creator.key(), &ctx.accounts.vault.key(), amount);
invoke(&ix, &[ctx.accounts.creator.to_account_info(),ctx.accounts.vault.to_account_info(),ctx.accounts.system_program.to_account_info()])?;
    Ok(())
}
