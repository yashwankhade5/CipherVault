
use anchor_lang::prelude::*;
#[derive(AnchorDeserialize,AnchorSerialize,Clone,Default)]
pub struct SplTokenData{
   pub mint:Pubkey,
   pub amount:u64
}

#[account]
pub struct TransactionAccount{
    pub multisig:Pubkey,
    pub valut:Pubkey,
    pub amount:u64,
    pub approval:Vec<bool>,
    pub spl_token:SplTokenData,
    pub executed:bool,  
    pub reciepient:Pubkey,
    pub proposer:Pubkey,
    pub date:i64
    
}
