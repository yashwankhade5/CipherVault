use anchor_lang::prelude::*;


// #[derive(AnchorDeserialize,AnchorSerialize,Clone)]
// pub struct Spltoken{
//     mint:Pubkey,
//     amount:u64
// }

#[account]
pub struct Multisig{
    pub creator:Pubkey,
    pub owners:Box<Vec<Pubkey>>,
    // pub spl_token:Box<Vec<Spltoken>>,
    pub threshold:u8,
    pub transaction_count:u32,
    pub name:String
}
