import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { OverviewTab } from './components/tabs/OverviewTab';
import { TransactionsTab } from './components/tabs/TransactionsTab';
import { MultisigsTab } from './components/tabs/MultisigsTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { WalletConnectPage } from './components/WalletConnectPage';
import { Toaster } from './components/ui/sonner';
import type { Multisig, Transaction } from "./utilis/vault-types";
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { transactionconvert, multisigConvert } from "./utilis/dataParser";
import { useWallet,useConnection } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import { BN,  } from "@coral-xyz/anchor";
import { getPDA } from "./utilis/pdaUtils";
import { useProgram } from './anchor/setup';

export type TabType = 'overview' | 'transactions' | 'multisigs' | 'settings';

export default function App() {
  const program = useProgram()
  const { connection } = useConnection();


  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const wallet = useWallet();
  const [multisigs, setMultisigs] = useState<Multisig[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);


  async function fetchmultisig() {
    if (!program) return
    const allmultisig = await program.account.multisig.all()
    if (!wallet.publicKey) return;
    const filteredmultisig = allmultisig.filter(acc => acc.account.owners.some(o => o.equals(wallet.publicKey!)))
    const mymultisig: Multisig[] = await Promise.all(filteredmultisig.map(
      async (eachmulti) => {
        const vaultpda = getPDA([new TextEncoder().encode("vault"), eachmulti.publicKey.toBytes()], program.programId)
        const vaultlamports = (await connection.getAccountInfo(vaultpda))?.lamports
        const newmultisig = multisigConvert(eachmulti.account, eachmulti.publicKey, vaultpda, vaultlamports)
        return newmultisig
      }))
    setMultisigs([...mymultisig])
  }

  async function fetchtransactions() {
    if (!program) return
    const allTransaction = await program.account.transactionAccount.all()
    const allMultisigPda = multisigs.map(x => x.pda)
    if (!wallet.publicKey) return;
    const filteredmultisig = allTransaction.filter(item =>
      allMultisigPda.some(pk => pk == item.account.multisig.toBase58())
    )

    let myTransaction = await Promise.all(filteredmultisig.map(
      async (eachtransaction) => {
        const multisigdata = multisigs.find(x => x.pda == eachtransaction.account.multisig.toBase58())
        if (!multisigdata) {
          return
        }
        const newTransaction = transactionconvert(eachtransaction.account, multisigdata, new PublicKey(multisigdata.pda), eachtransaction.publicKey)
        return newTransaction
      }))

    setTransactions(
      myTransaction.filter((tx): tx is Transaction => tx !== undefined)
    );

  }

  useEffect(() => {
    if (wallet.publicKey) fetchmultisig()
  }, [wallet.publicKey])

  useEffect(() => {
    if (multisigs.length > 0) fetchtransactions()

  }, [multisigs])

  useEffect(() => {
    if (!multisigs || multisigs.length === 0) return

    const listeners: number[] = []

    multisigs.forEach(msig => {
      const l = connection.onAccountChange(new PublicKey(msig.pda), () => {
        fetchmultisig()
        fetchtransactions()
      })
      listeners.push(l)
    })

    return () => {
      listeners.forEach(l => connection.removeAccountChangeListener(l))
    }
  }, [multisigs])

  const handleCreateMultisig = async (multisig: Omit<Multisig, 'id' | 'createdAt' | 'txPending' | 'creator' | 'transactionCount' | 'vaultaddress'>) => {
    if (!wallet.publicKey) return;
    if (!program) {
      return <div className="text-center p-8">Loading program…</div>;
    }
    const validpubkeyarray = multisig.owners.map(owner => new PublicKey(owner))
    const multiSigPda = getPDA([Buffer.from("multisig"), wallet.publicKey.toBuffer(), Buffer.from(multisig.name)], program.programId)


    const vaultpda = getPDA([Buffer.from("vault"), multiSigPda.toBuffer()], program.programId)
    try {
      const solAmount = multisig.balance
      const lamports = new BN(Math.round(solAmount * LAMPORTS_PER_SOL));

      const tx = await program.methods.createMultisig(multisig.threshold, validpubkeyarray, multisig.name,lamports).accounts({
        creator: wallet.publicKey,
        
      }).rpc()


      
     
      await program.provider.connection.confirmTransaction(tx, "confirmed")
      const multisigdata = await program.account.multisig.fetch(multiSigPda)

      const vaultdata = await program.provider.connection.getAccountInfo(vaultpda)
       toast.success('Multisig created successfully');
      
      if (!vaultdata?.lamports) {
        return
      }
      const newMultisig = multisigConvert(multisigdata, multiSigPda, vaultpda, vaultdata.lamports)
      setMultisigs([...multisigs, newMultisig]);
    } catch (error: any) {
      console.error("Multisig creation failed:", error);
      toast.error(error?.message || "Multisig creation failed");
    }

  };

  const handleCreateTransaction = async (transaction: Omit<Transaction, 'id' | 'pda' | 'createdAt' | 'approvals' | 'approvedBy' | 'status'>) => {
    if (!wallet.publicKey) return;
    if (!program) {
      return <div className="text-center p-8">Loading program…</div>;
    }
    const multisiginfo = multisigs.find(v => v.id == transaction.multisigId)
    if (!multisiginfo) {
      console.error("Multisig not found for this transaction");
      toast.error("Multisig not found");
      return;
    }
    if (!multisiginfo?.pda) return
    const multisigpda = new PublicKey(multisiginfo?.pda)
    const transBuffer = Buffer.alloc(4)
    transBuffer.writeUInt32LE(multisiginfo?.transactionCount as number);
    const transactionpda = getPDA([Buffer.from("transaction"), multisigpda.toBuffer(), transBuffer], program.programId)
    const vaultpda = getPDA([new TextEncoder().encode("vault"), multisigpda.toBytes()], program.programId)
    try {
        const solAmount = parseFloat(transaction.amount)
      const lamports = new BN(Math.round(solAmount * LAMPORTS_PER_SOL));

     
      console.log("reciepient key", transaction.recipient)
      const tx = await program.methods.createTransaction(lamports, null).accounts({
        reciepient: new PublicKey(transaction.recipient),
        proposer: wallet.publicKey,
        vault: vaultpda,
        multisig: multisigpda,
      }).rpc()
      await program.provider.connection.confirmTransaction(tx, "confirmed")
      toast.success("transaction created successfully")
      if (!multisiginfo?.transactionCount) {
        return;
      }

      const transactiondata = await program.account.transactionAccount.fetch(transactionpda)

      const newTransaction: Transaction = transactionconvert(transactiondata, multisiginfo, multisigpda, transactionpda)
      setTransactions([...transactions, newTransaction]);

      const newmultisiginfo = await program.account.multisig.fetch(multisigpda)
      
      setMultisigs(multisigs => {
        let updatedmultisig = [...multisigs]
      const indexofmultisiginfo = multisigs.findIndex(multisig => multisig.pda == multisigpda.toBase58())
      updatedmultisig[indexofmultisiginfo] = {
        ...updatedmultisig[indexofmultisiginfo],
        txPending: newmultisiginfo.txPending
      }
      return [...updatedmultisig]
      })
    } catch (error: any) {

      console.error("Transaction failed:", error);
      toast.error(error?.message || "Transaction failed");
    }
  };

  const handleApproveTransaction = async (txId: string) => {
    if (!wallet.publicKey) return;
    if (!program) {
      return <div className="text-center p-8">Loading program…</div>;
    }
    const transactioninfo = transactions.find(tx => tx.id == txId)
    const multiSig = multisigs.find(x => x.id == transactioninfo?.multisigId)
    const multiSigpda = new PublicKey(multiSig?.pda as string)

    if (!multiSigpda) return
    if (!transactioninfo?.pda) return;
    const transactionpda = new PublicKey(transactioninfo?.pda)
    console.log(transactionpda.toBase58())
    try {


      const _txapprove = await program.methods.approval().accountsStrict({
        approver: wallet.publicKey,
        multisig: multiSigpda,
        transaction: transactionpda,
      }).rpc()

      await connection.confirmTransaction(_txapprove)
      console.log("txsign",_txapprove)

      const transactionfetcheddata = await program.account.transactionAccount.fetch(transactioninfo.pda)
      if (!multiSig) return
      const txAccountState = transactionconvert(transactionfetcheddata, multiSig, multiSigpda, transactionpda)

      setTransactions(transactions => transactions.map(tx => {
        const walletpubkey = wallet.publicKey as PublicKey

        if (tx.id === txId && !tx.approvedBy.includes(walletpubkey.toBase58())) {

          return {
            ...txAccountState,
            status: txAccountState.approvals >= tx.threshold ? 'ready' : 'pending',
          };
        }
        return tx;
      }));
      toast.success("Transaction approved successfully")
    } catch (error: any) {
      console.error("Transaction Approval failed:", error);
      toast.error(error?.message || " Transaction Approval failed");
    }

  };


  const handleConnectWallet = (_wallet: PublicKey) => {};
  const handleDisconnectWallet = async () => {
    await wallet.disconnect()
    setActiveTab('overview');
  };

  const handleExecuteTransaction = async (txId: string) => {
    if (!program) {
      return <div className="text-center p-8">Loading program…</div>;
    }
    const transactioninfo = transactions.find(txin => txin.id == txId)
    if (!transactioninfo?.pda) return
    const multisiginfo = multisigs.find(x => x.name == transactioninfo.multisigName)
    const transactionPda = new PublicKey(transactioninfo?.pda)
    if (!multisiginfo?.vaultaddress && !multisiginfo?.pda) return
    try {


      const txExecu = await program.methods.fnExecute().accounts({
        multisig: new PublicKey(multisiginfo?.pda),
        vault: new PublicKey(multisiginfo?.vaultaddress),
        transactionAccount: transactionPda,
        reciepientAccount: new PublicKey(transactioninfo.recipient)
      }).rpc()

      console.log("txsign", txExecu)
      await program.provider.connection.confirmTransaction(txExecu, "confirmed")
      const transactionstate = await program.account.transactionAccount.fetch(transactionPda)

      setTransactions(transactions.map(tx =>
        tx.id === txId && transactionstate.executed
          ? { ...tx, status: 'executed' as const, executedAt: Date.now() }
          : tx
      ));

      // Update pending count
      const tx = transactions.find(t => t.id === txId);
      if (tx) {
        setMultisigs(multisigs.map(m =>
          m.id === tx.multisigId
            ? { ...m, txPending: multisiginfo.txPending }
            : m
        ));
      }
      toast.success("Transaction Executed Successfully")
    } catch (error: any) {
      console.error("Transaction approve failed:", error);
      toast.error(error?.transactionMessage || "Transaction approval failed");
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
  if (!wallet.connected) {
    return (
      <>
        <WalletConnectPage onConnect={handleConnectWallet} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {wallet.publicKey ? <><Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}

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
              connectedWallet={wallet.publicKey.toBase58()}
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
              connectedWallet={wallet.publicKey.toBase58()}
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
         
              onDisconnect={handleDisconnectWallet}
            />
          )}
        </div>

        <Toaster /></> : <>
        <WalletConnectPage onConnect={handleConnectWallet} />
        <Toaster />
      </>}
    </div>
  );
}
