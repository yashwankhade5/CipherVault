import { useState } from 'react';
import type { ReactNode } from 'react';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import type { Multisig, Transaction } from '../App';
import { toast } from 'sonner';

interface CreateTransactionDialogProps {
  multisigs: Multisig[];
  defaultMultisigId?: string;
  onCreateTransaction: (transaction: Omit<Transaction, 'id' | 'pda' | 'createdAt' | 'approvals' | 'approvedBy' | 'status'>) => void;
  children: ReactNode;
}

export function CreateTransactionDialog({ 
  multisigs, 
  defaultMultisigId,
  onCreateTransaction, 
  children 
}: CreateTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [multisigId, setMultisigId] = useState(defaultMultisigId || '');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('SOL');
  const [tokenMint, setTokenMint] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!multisigId || !recipient || !amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedMultisig = multisigs.find(m => m.id === multisigId);
    if (!selectedMultisig) {
      toast.error('Invalid multisig selected');
      return;
    }

    onCreateTransaction({
      multisigId,
      multisigName: selectedMultisig.name,
      recipient,
      amount,
      token,
      tokenMint: token !== 'SOL' ? tokenMint : undefined,
      threshold: selectedMultisig.threshold,
    });

    // Reset form
    setMultisigId(defaultMultisigId || '');
    setRecipient('');
    setAmount('');
    setToken('SOL');
    setTokenMint('');
    setOpen(false);
    
    toast.success('Transaction created successfully');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Transaction</DialogTitle>
          <DialogDescription>
            Create a new transaction for multisig approval
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <Label htmlFor="multisig">Multisig Wallet *</Label>
            <Select value={multisigId} onValueChange={setMultisigId}>
              <SelectTrigger id="multisig">
                <SelectValue placeholder="Select a multisig wallet" />
              </SelectTrigger>
              <SelectContent>
                {multisigs.map(m => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} ({m.threshold}/{m.owners.length} threshold)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="recipient">Recipient Address *</Label>
            <Input 
              id="recipient"
              placeholder="Enter Solana address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input 
                id="amount"
                type="number"
                step="0.000001"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="token">Token</Label>
              <Select value={token} onValueChange={setToken}>
                <SelectTrigger id="token">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="BONK">BONK</SelectItem>
                  <SelectItem value="Custom">Custom Token</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {token === 'Custom' && (
            <div>
              <Label htmlFor="tokenMint">Token Mint Address</Label>
              <Input 
                id="tokenMint"
                placeholder="Enter token mint address"
                value={tokenMint}
                onChange={(e) => setTokenMint(e.target.value)}
                className="font-mono"
              />
            </div>
          )}

          {multisigId && (
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="text-sm text-purple-900">
                This transaction will require{' '}
                <span className="font-semibold">
                  {multisigs.find(m => m.id === multisigId)?.threshold} approvals
                </span>
                {' '}from{' '}
                <span className="font-semibold">
                  {multisigs.find(m => m.id === multisigId)?.owners.length} signers
                </span>
                {' '}to execute.
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gap-2">
              <Send className="w-4 h-4" />
              Create Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
