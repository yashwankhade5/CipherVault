import  { PublicKey } from "@solana/web3.js";

export interface Multisig {
  id: string;
  name: string;
  pda: PublicKey;
  owners: PublicKey[];
  threshold: number;
  balance: string;
  currency: string;
  txPending: number;
  color: string;
  createdAt: number;
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
  approvedBy: PublicKey[];
  status: 'pending' | 'ready' | 'executed' | 'rejected';
  createdAt: number;
  executedAt?: number;
}