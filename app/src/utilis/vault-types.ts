
import { PublicKey } from "@solana/web3.js";

export interface Multisig {
  id: string;
  name: string;
  pda: string;
  creator:PublicKey;
  owners: string[];
  threshold: number;
  balance: number;
  currency: string;
  txPending: number;
  color: string;
  createdAt: number;
  transactionCount:number;
  vaultaddress:PublicKey
}

export interface Transaction {
  id: string;
  multisigId: string;
  multisigName: string;
  pda: string;
  recipient: string;
  amount: string;
  token: string;
  tokenMint?: string;
  approvals: number;
  threshold: number;
  approvedBy: string[];
  status: 'pending' | 'ready' | 'executed' | 'rejected';
  createdAt: number;
  executedAt?: number;
  executed:boolean;
}