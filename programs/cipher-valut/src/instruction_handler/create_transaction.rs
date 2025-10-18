use anchor_lang::prelude::*;
use crate::state::*;
use crate::MyError;



pub fn create_transaction_handler(ctx:Context<TransactionContext>,amount:Option<u64>,spl_token:Option<SplTokenData>)->Result<()>{
 let clock = Clock::get()?;
        ctx.accounts.transaction_account.multisig = ctx.accounts.multisig.key();
        ctx.accounts.transaction_account.amount = amount.unwrap_or(0) * 1_000_000_000;
        // ctx.accounts.transaction_account.spl_token = spl_token.unwrap_or_default();
        ctx.accounts.transaction_account.approval = vec![false; ctx.accounts.multisig.owners.len()];
        ctx.accounts.transaction_account.proposer = ctx.accounts.proposer.key();
        ctx.accounts.transaction_account.executed = false;
        ctx.accounts.transaction_account.date = clock.unix_timestamp;
        ctx.accounts.transaction_account.valut = ctx.accounts.vault.key();
        let owner_index = ctx
            .accounts
            .multisig
            .owners
            .iter()
            .position(|&a| a == ctx.accounts.proposer.key())
            .ok_or(MyError::ProposeNotinOwners)?;
    
        ctx.accounts.transaction_account.approval[owner_index] = true;

        Ok(())
    
}