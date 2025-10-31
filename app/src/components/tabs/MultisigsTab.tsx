import { Wallet, Plus, TrendingUp, ArrowDown } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CreateMultisigDialog } from '../CreateMultisigDialog';
import { CreateTransactionDialog } from '../CreateTransactionDialog';
import type { Multisig, Transaction } from '../../utilis/vault-types';
import { PublicKey } from '@solana/web3.js';
import {  useProgram } from "../../anchor/setup"

interface MultisigsTabProps {
  multisigs: Multisig[];
  transactions: Transaction[];

  onCreateMultisig: (multisig: Omit<Multisig, 'id' | 'createdAt' | 'txPending' | 'creator' | 'transactionCount'| 'vaultaddress'>) => void;
  onCreateTransaction: (transaction: Omit<Transaction, 'id' | 'pda' | 'createdAt' | 'approvals' | 'approvedBy' | 'status'>) => void;
}

export function MultisigsTab({
  multisigs,
  transactions,
  onCreateMultisig,
  onCreateTransaction
}: MultisigsTabProps) {
  const totalValue = multisigs.reduce((sum, m) => sum + m.balance, 0);
const program  = useProgram();
   if (!program) return
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-slate-900 mb-2">Multisig Wallets</h1>
          <p className="text-slate-600">Manage your multisig wallets and signers</p>
        </div>
        <CreateMultisigDialog onCreateMultisig={onCreateMultisig}>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Multisig
          </Button>
        </CreateMultisigDialog>
      </div>

      {/* Summary Card */}
      <Card className="p-6 mb-8 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-600 mb-1">Total Treasury Value</div>
            <div className="text-slate-900 flex items-baseline gap-2">
              <span>{totalValue.toLocaleString()}</span>
              <span className="text-lg text-slate-600">SOL</span>
            </div>
            <div className="text-sm text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Across {multisigs.length} multisig wallets
            </div>
          </div>
          <div className="p-4 bg-purple-100 rounded-full">
            <Wallet className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </Card>

      {/* Multisig Cards */}
      <div className="grid grid-cols-1 gap-6">
        {multisigs.map((multisig) => {
          const multisigTxs = transactions.filter(t => t.multisigId === multisig.id);
          const pendingTxs = multisigTxs.filter(t => t.status === 'pending' || t.status === 'ready');
         

          return (
            <Card key={multisig.pda} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 ${multisig.color} rounded-xl flex items-center justify-center`}>
                    <Wallet className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 mb-1">{multisig.name}</h3>
                    <div className="text-sm text-slate-600 mb-2">
                      {multisig.threshold} of {multisig.owners.length} signatures required
                    </div>
                    <div className="font-mono text-xs text-slate-500">
                      PDA: {multisig.pda}
                    </div>
                    <div className="font-mono text-xs text-slate-500">
                      Vault:{PublicKey.findProgramAddressSync([new TextEncoder().encode("vault"), new PublicKey(multisig.pda).toBuffer()], program?.programId)[0].toBase58().toString()}
                    </div>
                  </div>
                </div>

                {pendingTxs.length > 0 && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    {pendingTxs.length} pending
                  </Badge>
                )}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-200">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-1">Balance</div>
                  <div className="text-slate-900">{multisig.balance} {multisig.currency}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-1">Total Signers</div>
                  <div className="text-slate-900">{multisig.owners.length}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-1">Total Transactions</div>
                  <div className="text-slate-900">{multisig.transactionCount}</div>
                </div>
              </div>

              {/* Owners List */}
              <div className="mb-6">
                <div className="text-sm text-slate-600 mb-3">Signers</div>
                <div className="space-y-2">
                  {multisig.owners.map((owner, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <div className="font-mono text-slate-600">{owner}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <CreateTransactionDialog
                  multisigs={multisigs}
                  defaultMultisigId={multisig.id}
                  onCreateTransaction={onCreateTransaction}
                >
                  <Button variant="outline" className="flex-1 gap-2">
                    <ArrowDown className="w-4 h-4" />
                    New Transaction
                  </Button>
                </CreateTransactionDialog>
                <Button variant="outline" className="gap-2">
                  View Details
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
