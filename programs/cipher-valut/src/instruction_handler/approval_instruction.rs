use anchor_lang::prelude::*;
use  crate::state::{ApprovalContext};
use crate::MyError;

pub fn approval_handler(ctx:Context<ApprovalContext>)->Result<()>{
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