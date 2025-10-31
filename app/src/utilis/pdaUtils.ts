import { PublicKey } from "@solana/web3.js";





     
export function getPDA(seeds:(Buffer | Uint8Array)[],programId:PublicKey) {
    
    let[pda,_bump] = PublicKey.findProgramAddressSync(seeds,programId)
    return pda
}