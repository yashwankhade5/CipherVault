import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { OverviewTab } from './components/tabs/OverviewTabs';
import { TransactionsTab } from './components/tabs/TransactionsTab';
import { MultisigsTab } from './components/tabs/Multisigstabs';
import { SettingsTab } from './components/tabs/SettingsTabs';
import { WalletConnectPage } from './components/WalletConnectPage';
import { Toaster } from './components/ui/sonner';
import './App.css'
import type { Multisig,Transaction } from "./typescipervault";
import  { PublicKey } from "@solana/web3.js";
import { Wallet } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';



export type TabType = 'overview' | 'transactions' | 'multisigs' | 'settings';



export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [connectedWallet, setConnectedWallet] = useState<PublicKey | null>(null);
  const [multisigs, setMultisigs] = useState<Multisig[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const wallet = useWallet()

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

    // setTransactions(transactions.map(tx => {
    //   if (tx.id === txId && !tx.approvedBy.includes(connectedWallet)) {
    //     const newApprovals = tx.approvals + 1;
    //     const newApprovedBy = [...tx.approvedBy, connectedWallet];
    //     return {
    //       ...tx,
    //       approvals: newApprovals,
    //       approvedBy: newApprovedBy,
    //       status: newApprovals >= tx.threshold ? 'ready' : 'pending',
    //     };
    //   }
    //   return tx;
    // }));
  };

  const handleConnectWallet = (wallet:PublicKey | null) => {
    setConnectedWallet(wallet);
  };

  const handleDisconnectWallet = async () => {
   await  wallet.disconnect();
    
    setActiveTab('overview');
    setConnectedWallet(null);
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
            connectedWallet={wallet.publicKey}
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
            connectedWallet={wallet.publicKey}
            onDisconnect={handleDisconnectWallet}
          />
        )}
      </div>

      <Toaster />
      

    </div>
   
  );
}
