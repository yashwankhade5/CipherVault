import type { PublicKey } from "@solana/web3.js";
import type { BN } from "@coral-xyz/anchor";
import type { Multisig,Transaction } from "./vault-types";


interface transactiondatarecieved {
    multisig: PublicKey;
    valut: PublicKey;
    amount: BN;
    approval: boolean[];
    splToken:any
    executed: boolean;
    reciepient: PublicKey;
    proposer: PublicKey;
    date: BN;
    executedAt:BN
}
  
   
   
    
   

interface multisigdatarecieved {
    creator: PublicKey,
    owners: PublicKey[],
    splToken: any[],
    threshold: number,
    transactionCount: number,
    name: string,
    vault: PublicKey,
    txPending: number,
}





export function transactionconvert(transactiondata: transactiondatarecieved, multisigdata: Multisig, multisigpda: PublicKey, transactionpda: PublicKey) {
    let approvedarray = transactiondata.approval.filter((approved: boolean) => approved == true)

    let approved = approvedarray.length
    
    let indexsof_aprovedby = transactiondata.approval.reduce((acc: number[], val: boolean, idx: number) => {
        if (val) acc.push(idx);
        return acc;
    }, []);
    let status_state: 'pending' | 'ready' | 'executed' | 'rejected' = 'pending'
    let approved_by: string[] = indexsof_aprovedby.map((idx: number) => multisigdata.owners[idx])
    if (approved < multisigdata.threshold) {
        status_state = 'pending'
    } else if (approved >= multisigdata.threshold && !transactiondata.executed) {
        status_state = 'ready'
    } else if (approved >= multisigdata.threshold && transactiondata.executed) {
        status_state = 'executed'
    }


    let transaction: Transaction = {
        id: String(transactiondata.date),
        multisigId: multisigpda.toBase58().substring(0, 4),
        multisigName: multisigdata.name,
        pda: transactionpda.toBase58(),
        recipient: transactiondata.reciepient.toBase58(),
        amount: String(transactiondata.amount),
        token: 'SOL',
        tokenMint: "111111",
        approvals: approved,
        threshold: multisigdata.threshold,
        approvedBy: approved_by,
        status: status_state,
        createdAt: transactiondata.date.toNumber(),
        executedAt: transactiondata.executedAt.toNumber(),
      executed:transactiondata.executed
    }

    return transaction
}

export function  multisigConvert(multisigdata:multisigdatarecieved,multisigpda:PublicKey,vaultpda:PublicKey,vaultlamports:BN) {
    

    const validowners = multisigdata.owners.map(owner => owner.toBase58())
            const newmultisig: Multisig = {
              id: multisigpda.toBase58().substring(0, 4),
              name: multisigdata.name,
              pda: multisigpda.toBase58(),
              creator: multisigdata.creator,
              owners: validowners,
              threshold: multisigdata.threshold,
              balance: (vaultlamports as number) / 1000000000,
              currency: "SOL",
              txPending: multisigdata.txPending,
              color: "bg-blue-600",
              createdAt: Date.now(),
              transactionCount: multisigdata.transactionCount,
              vaultaddress:vaultpda
            }
            return newmultisig
}
const order:Record<'pending' | 'ready' | 'executed' | 'rejected',number>={
    'pending' :1,
     'ready' :2,
     'executed':3,
     'rejected':4
}
export function transactionsorter(transactionarray:Transaction[]) {
    return transactionarray.sort((a,b)=>order[a.status]-order[b.status])
}