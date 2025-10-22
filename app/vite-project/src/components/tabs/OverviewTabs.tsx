import { Wallet, Users, Clock, CheckCircle2, TrendingUp, Send } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { TransactionTable } from '../TransactionTable';
import { MultisigCard } from '../MultisigCard';
import { CreateTransactionDialog } from '../CreateTransactionDialog';
import type { Multisig, Transaction } from './Multisigstabs';

interface OverviewTabProps {
  multisigs: Multisig[];
  transactions: Transaction[];
  onCreateTransaction: (transaction: Omit<Transaction, 'id' | 'pda' | 'createdAt' | 'approvals' | 'approvedBy' | 'status'>) => void;
  onApproveTransaction: (txId: string) => void;
  onExecuteTransaction: (txId: string) => void;
  connectedWallet: string;
}

export function OverviewTab({ 
  multisigs, 
  transactions, 
  onCreateTransaction,
  onApproveTransaction,
  onExecuteTransaction,
  connectedWallet
}: OverviewTabProps) {
  const totalValue = multisigs.reduce((sum, m) => sum + parseFloat(m.balance), 0);
  const pendingCount = transactions.filter(t => t.status === 'pending' || t.status === 'ready').length;
  const completedLast30Days = transactions.filter(t => 
    t.status === 'executed' && 
    t.executedAt && 
    Date.now() - t.executedAt < 30 * 24 * 60 * 60 * 1000
  ).length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending' || t.status === 'ready');

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Treasury Dashboard</h1>
        <p className="text-slate-600">Manage your multisig wallets and transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Wallet className="w-5 h-5 text-purple-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-slate-600 text-sm mb-1">Total Value Locked</div>
          <div className="text-slate-900">{totalValue.toLocaleString()} SOL</div>
          <div className="text-green-600 text-xs mt-2">Across {multisigs.length} multisigs</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-slate-600 text-sm mb-1">Active Multisigs</div>
          <div className="text-slate-900">{multisigs.length}</div>
          <div className="text-slate-500 text-xs mt-2">Across all treasuries</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="text-slate-600 text-sm mb-1">Pending Approvals</div>
          <div className="text-slate-900">{pendingCount}</div>
          {pendingCount > 0 && (
            <div className="text-orange-600 text-xs mt-2">Requires your action</div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-slate-600 text-sm mb-1">Completed (30d)</div>
          <div className="text-slate-900">{completedLast30Days}</div>
          <div className="text-slate-500 text-xs mt-2">Successful transactions</div>
        </Card>
      </div>

      {/* Pending Transactions Table */}
      <Card className="mb-8">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-slate-900 mb-1">Pending Transactions</h2>
              <p className="text-slate-600 text-sm">Review and approve pending transactions</p>
            </div>
            <CreateTransactionDialog 
              multisigs={multisigs}
              onCreateTransaction={onCreateTransaction}
            >
              <Button className="gap-2">
                <Send className="w-4 h-4" />
                New Transaction
              </Button>
            </CreateTransactionDialog>
          </div>
        </div>
        
        <TransactionTable 
          transactions={pendingTransactions}
          onApproveTransaction={onApproveTransaction}
          onExecuteTransaction={onExecuteTransaction}
          connectedWallet={connectedWallet}
          compact
        />
      </Card>

      {/* Active Multisigs */}
      <div>
        <h2 className="text-slate-900 mb-4">Active Multisigs</h2>
        <div className="grid grid-cols-2 gap-6">
          {multisigs.map((multisig) => (
            <MultisigCard key={multisig.id} multisig={multisig} />
          ))}
        </div>
      </div>
    </div>
  );
}
