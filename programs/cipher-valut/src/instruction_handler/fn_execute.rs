use anchor_lang::{prelude::*, system_program::{transfer,Transfer},solana_program::{program::invoke_signed, instruction::{Instruction, AccountMeta}}};
use crate::state::{multisig::{self, Multisig},transaction::*};
use crate::{MyError};

pub fn transaction_execute(ctx:Context<TransactionExecuteContext>)->Result<()>{
let sol_amount = ctx.accounts.transaction_account.amount;
let spl_token = &ctx.accounts.transaction_account.spl_token.amount;
let threshold = ctx.accounts.multisig.threshold;
let multisig = ctx.accounts.multisig.key();
let approvals  = &ctx.accounts.transaction_account.approval;
let approval_count = approvals.iter().filter(|&&a| a== true).count() as u8;
let reciepient = ctx.accounts.transaction_account.reciepient;
let vault = ctx.accounts.vault.key();
let system_program= ctx.accounts.system_program.to_account_info();


require!(threshold>approval_count,MyError::NotEnoughApproval);
let account_meta = vec![
    AccountMeta::new(vault, true),
    AccountMeta::new(reciepient, true),
];

if sol_amount>0 {
    let ins_discriminator:u32 =2;
    let mut  instruction_data = vec![];
    instruction_data.extend_from_slice(&ins_discriminator.to_le_bytes());
    instruction_data.extend_from_slice(&sol_amount.to_le_bytes());
   let ix = Instruction {
    program_id:ctx.accounts.system_program.key(),
    accounts:account_meta,
    data:instruction_data

   };
   let reciepient_account = ctx.remaining_accounts.iter().find(|a| a.key() == reciepient).ok_or(MyError::ReciepientAccountNotReceived);
   let accounts_info=[ctx.accounts.vault.to_account_info(),*reciepient_account?,system_program];
   let signers_seeds=[b"multisig",multisig.key().as_ref()];

   invoke_signed(&ix, &accounts_info, signers_seeds);
}

    Ok(())
}


#[derive(Accounts)]
pub struct TransactionExecuteContext<'info>{
    #[account(mut)]
    pub multisig: Account<'info,Multisig>,
    pub transaction_account:Account<'info,TransactionAccount>,

    /// CHECK: this sol vault not dataccount
    /// 
    pub vault:AccountInfo<'info>,
    
    pub system_program:Program<'info,System>
}