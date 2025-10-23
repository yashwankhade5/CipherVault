import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { OverviewTab } from './components/tabs/OverviewTabs';
import { TransactionsTab } from './components/tabs/TransactionsTab';
import { MultisigsTab } from './components/tabs/Multisigstabs';
import { SettingsTab } from './components/tabs/SettingsTabs';
import { WalletConnectPage } from './components/WalletConnectPage';
import { Toaster } from './components/ui/sonner';
import './App.css'



export type TabType = 'overview' | 'transactions' | 'multisigs' | 'settings';

export interface Multisig {
  id: string;
  name: string;
  pda: string;
  owners: string[];
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
  approvedBy: string[];
  status: 'pending' | 'ready' | 'executed' | 'rejected';
  createdAt: number;
  executedAt?: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  

  // Mock data - in production, this would come from Solana
  const [multisigs, setMultisigs] = useState<Multisig[]>([
    {
      id: '1',
      name: 'Operations Treasury',
      pda: '7xK9p3xY2pmL3p8K9xY2pmL3p8K9xY2pmL3p8K',
      owners: ['7xK9p3xY2pmL3p', '8sK2pL9mxY2p3K', 'Bm7knR4txY2p3K', 'Cn8mpS5uyZ3q4L', 'Dm9nqT6vzA4r5M'],
      threshold: 3,
      balance: '125430.50',
      currency: 'SOL',
      txPending: 2,
      color: 'bg-purple-500',
      createdAt: Date.now() - 86400000 * 30,
    },
    {
      id: '2',
      name: 'Development Fund',
      pda: '8sK2pL9mxY2p3K9xY2pmL3p8K9xY2pmL3p8K',
      owners: ['7xK9p3xY2pmL3p', '8sK2pL9mxY2p3K', 'Bm7knR4txY2p3K'],
      threshold: 2,
      balance: '45220.75',
      currency: 'SOL',
      txPending: 1,
      color: 'bg-blue-500',
      createdAt: Date.now() - 86400000 * 15,
    },
    {
      id: '3',
      name: 'Marketing Budget',
      pda: 'Bm7knR4txY2p3K9xY2pmL3p8K9xY2pmL3p8K',
      owners: ['7xK9p3xY2pmL3p', '8sK2pL9mxY2p3K', 'Cn8mpS5uyZ3q4L', 'Dm9nqT6vzA4r5M'],
      threshold: 2,
      balance: '22100.00',
      currency: 'SOL',
      txPending: 0,
      color: 'bg-pink-500',
      createdAt: Date.now() - 86400000 * 10,
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      multisigId: '1',
      multisigName: 'Operations Treasury',
      pda: 'TxBm7knR4txY2p3K9xY2pmL3p8K9xY2pmL3p8K',
      recipient: 'GjK9p3xY2pmL3p8K9xY2pmL3p8K9xY2pmL3p8K',
      amount: '1500.00',
      token: 'SOL',
      approvals: 2,
      threshold: 3,
      approvedBy: ['7xK9p3xY2pmL3p', '8sK2pL9mxY2p3K'],
      status: 'pending',
      createdAt: Date.now() - 7200000,
    },
    {
      id: '2',
      multisigId: '1',
      multisigName: 'Operations Treasury',
      pda: 'TxCn8mpS5uyZ3q4L0yZ3rmM4q9L0yZ3rmM4q9L',
      recipient: '8sK2pL9mxY2p3K9xY2pmL3p8K9xY2pmL3p8K',
      amount: '500.00',
      token: 'USDC',
      tokenMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      approvals: 3,
      threshold: 3,
      approvedBy: ['7xK9p3xY2pmL3p', '8sK2pL9mxY2p3K', 'Bm7knR4txY2p3K'],
      status: 'ready',
      createdAt: Date.now() - 18000000,
    },
    {
      id: '3',
      multisigId: '2',
      multisigName: 'Development Fund',
      pda: 'TxDm9nqT6vzA4r5M0zA5snN5r0M0zA5snN5r0M',
      recipient: 'Dm9nqT6vzA4r5M0zA5snN5r0M0zA5snN5r0M',
      amount: '2000.00',
      token: 'SOL',
      approvals: 1,
      threshold: 2,
      approvedBy: ['7xK9p3xY2pmL3p'],
      status: 'pending',
      createdAt: Date.now() - 86400000,
    },
  ]);

  const handleCreateMultisig = (multisig: Omit<Multisig, 'id' | 'createdAt' | 'txPending'>) => {
    const newMultisig: Multisig = {
      ...multisig,
      id: Date.now().toString(),
      createdAt: Date.now(),
      txPending: 0,
    };
    setMultisigs([...multisigs, newMultisig]);
  };

  const handleCreateTransaction = (transaction: Omit<Transaction, 'id' | 'pda' | 'createdAt' | 'approvals' | 'approvedBy' | 'status'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      pda: `Tx${Math.random().toString(36).substring(2, 15)}`,
      approvals: 0,
      approvedBy: [],
      status: 'pending',
      createdAt: Date.now(),
    };
    setTransactions([...transactions, newTransaction]);

    // Update pending count
    setMultisigs(multisigs.map(m =>
      m.id === transaction.multisigId
        ? { ...m, txPending: m.txPending + 1 }
        : m
    ));
  };

  const handleApproveTransaction = (txId: string) => {
    if (!connectedWallet) return;

    setTransactions(transactions.map(tx => {
      if (tx.id === txId && !tx.approvedBy.includes(connectedWallet)) {
        const newApprovals = tx.approvals + 1;
        const newApprovedBy = [...tx.approvedBy, connectedWallet];
        return {
          ...tx,
          approvals: newApprovals,
          approvedBy: newApprovedBy,
          status: newApprovals >= tx.threshold ? 'ready' : 'pending',
        };
      }
      return tx;
    }));
  };

  const handleConnectWallet = (wallet: string) => {
    setConnectedWallet(wallet);
  };

  const handleDisconnectWallet = () => {
    setConnectedWallet(null);
    setActiveTab('overview');
  };

  const handleExecuteTransaction = (txId: string) => {
    setTransactions(transactions.map(tx =>
      tx.id === txId
        ? { ...tx, status: 'executed' as const, executedAt: Date.now() }
        : tx
    ));

    // Update pending count
    const tx = transactions.find(t => t.id === txId);
    if (tx) {
      setMultisigs(multisigs.map(m =>
        m.id === tx.multisigId
          ? { ...m, txPending: Math.max(0, m.txPending - 1) }
          : m
      ));
    }
  };

  const handleRejectTransaction = (txId: string) => {
    setTransactions(transactions.map(tx =>
      tx.id === txId
        ? { ...tx, status: 'rejected' as const }
        : tx
    ));

    // Update pending count
    const tx = transactions.find(t => t.id === txId);
    if (tx) {
      setMultisigs(multisigs.map(m =>
        m.id === tx.multisigId
          ? { ...m, txPending: Math.max(0, m.txPending - 1) }
          : m
      ));
    }
  };

  // Show wallet connect page if not connected
  if (!connectedWallet) {
    return (
      <>
        <WalletConnectPage onConnect={handleConnectWallet} />
        <Toaster />
      </>
    );
  }

  return (
      
    <div className="flex h-screen bg-slate-50">
      
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        connectedWallet={connectedWallet}
        onDisconnect={handleDisconnectWallet}
      />

      <div className="flex-1 overflow-auto">
        {activeTab === 'overview' && (
          <OverviewTab
            multisigs={multisigs}
            transactions={transactions}
            onCreateTransaction={handleCreateTransaction}
            onApproveTransaction={handleApproveTransaction}
            onExecuteTransaction={handleExecuteTransaction}
            connectedWallet={connectedWallet}
          />
        )}
        {activeTab === 'transactions' && (
          <TransactionsTab
            multisigs={multisigs}
            transactions={transactions}
            onCreateTransaction={handleCreateTransaction}
            onApproveTransaction={handleApproveTransaction}
            onExecuteTransaction={handleExecuteTransaction}
            onRejectTransaction={handleRejectTransaction}
            connectedWallet={connectedWallet}
          />
        )}
        {activeTab === 'multisigs' && (
          <MultisigsTab
            multisigs={multisigs}
            transactions={transactions}
            onCreateMultisig={handleCreateMultisig}
            onCreateTransaction={handleCreateTransaction}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTab
            connectedWallet={connectedWallet}
            onDisconnect={handleDisconnectWallet}
          />
        )}
      </div>

      <Toaster />
      

    </div>
   
  );
}
