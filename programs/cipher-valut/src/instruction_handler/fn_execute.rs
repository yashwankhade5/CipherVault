use crate::state::{
    multisig::{self, Multisig},
    transaction::*,
};
use crate::MyError;
use anchor_lang::{
    prelude::*,
    solana_program::{
        instruction::{AccountMeta, Instruction},
        program::invoke_signed,
        system_program::*,
    },
    system_program::{transfer, Transfer},
};

pub fn transaction_execute(ctx: Context<TransactionExecuteContext>) -> Result<()> {
    let sol_amount = ctx.accounts.transaction_account.amount;
    // let spl_token = &ctx.accounts.transaction_account.spl_token.amount;
    let threshold = ctx.accounts.multisig.threshold;
    let multisig = ctx.accounts.multisig.key();
    let approvals = &ctx.accounts.transaction_account.approval;
    let approval_count = approvals.iter().filter(|&&a| a == true).count() as u8;
    let reciepient = ctx.accounts.transaction_account.reciepient;
    let vault = ctx.accounts.vault.key();
    let system_program = ctx.accounts.system_program.to_account_info();
    let vbump = ctx.accounts.multisig.vaultbump;
    let reciepient_account_info = ctx.accounts.reciepient_account.to_account_info();
    let vault_info = ctx.accounts.vault.to_account_info();
    msg!("threshold{}", threshold);
    msg!("threshold{}", approval_count);

    // require!(threshold < approval_count, MyError::NotEnoughApproval);
    let account_meta = vec![
        AccountMeta::new(vault_info.key(), true),
        AccountMeta::new(reciepient_account_info.key(), false),
    ];

    let ins_discriminator: u32 = 2;
    let mut instruction_data = vec![];
    instruction_data.extend_from_slice(&ins_discriminator.to_le_bytes());
    instruction_data.extend_from_slice(&sol_amount.to_le_bytes());
    let ix =  anchor_lang::solana_program::instruction::Instruction {
        program_id: ctx.accounts.system_program.key(),
        accounts: account_meta,
        data: instruction_data,
    };

    let accoun = [
        vault_info.to_account_info(),
        reciepient_account_info.to_account_info(),
    ];

    let signers_seeds = [b"multisig", multisig.as_ref(), &[vbump]];

    invoke_signed(&ix, &accoun[..], &[&signers_seeds[..]])?;

    Ok(())
}

#[derive(Accounts)]
pub struct TransactionExecuteContext<'info> {
    #[account(mut)]
    pub multisig: Account<'info, Multisig>,
    pub transaction_account: Account<'info, TransactionAccount>,
    #[account(mut)]
    /// CHECK: this sol vault not dataccount
    pub vault: AccountInfo<'info>,
    /// CHECK: this sol vault not dataccount
    pub reciepient_account: AccountInfo<'info>,
    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}
