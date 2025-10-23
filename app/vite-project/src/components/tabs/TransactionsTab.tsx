import { useState } from 'react';
import { Send, Filter, Search } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { TransactionTable } from '../TransactionTable';
import { CreateTransactionDialog } from '../CreateTransactionDialog';
import type { Multisig, Transaction } from '../../typescipervault';
import  { PublicKey } from "@solana/web3.js";

interface TransactionsTabProps {
  multisigs: Multisig[];
  transactions: Transaction[];
  onCreateTransaction: (transaction: Omit<Transaction, 'id' | 'pda' | 'createdAt' | 'approvals' | 'approvedBy' | 'status'>) => void;
  onApproveTransaction: (txId: string) => void;
  onExecuteTransaction: (txId: string) => void;
  onRejectTransaction: (txId: string) => void;
  connectedWallet: PublicKey | null;
}

export function TransactionsTab({ 
  multisigs,
  transactions, 
  onCreateTransaction,
  onApproveTransaction,
  onExecuteTransaction,
  onRejectTransaction,
  connectedWallet
}: TransactionsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMultisig, setSelectedMultisig] = useState<string>('all');

  const filterTransactions = (status?: string) => {
    let filtered = transactions;

    if (status) {
      filtered = filtered.filter(t => t.status === status);
    }

    if (selectedMultisig !== 'all') {
      filtered = filtered.filter(t => t.multisigId === selectedMultisig);
    }

    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.multisigName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const pendingTxs = filterTransactions('pending');
  const readyTxs = filterTransactions('ready');
  const executedTxs = filterTransactions('executed');
  const allTxs = filterTransactions();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-slate-900 mb-2">All Transactions</h1>
          <p className="text-slate-600">View and manage all multisig transactions</p>
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

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Search by recipient, ID, or multisig..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedMultisig} onValueChange={setSelectedMultisig}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by multisig" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Multisigs</SelectItem>
              {multisigs.map(m => (
                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Transactions Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({allTxs.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingTxs.length})</TabsTrigger>
          <TabsTrigger value="ready">Ready ({readyTxs.length})</TabsTrigger>
          <TabsTrigger value="executed">Executed ({executedTxs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <TransactionTable 
              transactions={allTxs}
              onApproveTransaction={onApproveTransaction}
              onExecuteTransaction={onExecuteTransaction}
              onRejectTransaction={onRejectTransaction}
              connectedWallet={connectedWallet}
            />
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <TransactionTable 
              transactions={pendingTxs}
              onApproveTransaction={onApproveTransaction}
              onExecuteTransaction={onExecuteTransaction}
              onRejectTransaction={onRejectTransaction}
              connectedWallet={connectedWallet}
            />
          </Card>
        </TabsContent>

        <TabsContent value="ready">
          <Card>
            <TransactionTable 
              transactions={readyTxs}
              onApproveTransaction={onApproveTransaction}
              onExecuteTransaction={onExecuteTransaction}
              onRejectTransaction={onRejectTransaction}
              connectedWallet={connectedWallet}
            />
          </Card>
        </TabsContent>

        <TabsContent value="executed">
          <Card>
            <TransactionTable 
              transactions={executedTxs}
              onApproveTransaction={onApproveTransaction}
              onExecuteTransaction={onExecuteTransaction}
              onRejectTransaction={onRejectTransaction}
              connectedWallet={connectedWallet}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
