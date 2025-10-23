import { useState } from 'react';
import type { ReactNode } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import type { Multisig } from '../typescipervault';
import { toast } from 'sonner';

interface CreateMultisigDialogProps {
  onCreateMultisig: (multisig: Omit<Multisig, 'id' | 'createdAt' | 'txPending'>) => void;
  children: ReactNode;
}

export function CreateMultisigDialog({ onCreateMultisig, children }: CreateMultisigDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [threshold, setThreshold] = useState('2');
  const [owners, setOwners] = useState(['', '']);
  const [balance, setBalance] = useState('0');

  const handleAddOwner = () => {
    setOwners([...owners, '']);
  };

  const handleRemoveOwner = (index: number) => {
    if (owners.length > 2) {
      setOwners(owners.filter((_, i) => i !== index));
    }
  };

  const handleOwnerChange = (index: number, value: string) => {
    const newOwners = [...owners];
    newOwners[index] = value;
    setOwners(newOwners);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !threshold) {
      toast.error('Please fill in all required fields');
      return;
    }

    const validOwners = owners.filter(o => o.trim() !== '');
    if (validOwners.length < 2) {
      toast.error('At least 2 owners are required');
      return;
    }

    const thresholdNum = parseInt(threshold);
    if (thresholdNum < 1 || thresholdNum > validOwners.length) {
      toast.error(`Threshold must be between 1 and ${validOwners.length}`);
      return;
    }

    const colors = ['bg-purple-500', 'bg-blue-500', 'bg-pink-500', 'bg-indigo-500', 'bg-violet-500'];
    
    onCreateMultisig({
      name,
      pda: `MS${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      owners: validOwners,
      threshold: thresholdNum,
      balance,
      currency: 'SOL',
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    // Reset form
    setName('');
    setThreshold('2');
    setOwners(['', '']);
    setBalance('0');
    setOpen(false);
    
    toast.success('Multisig created successfully');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Multisig</DialogTitle>
          <DialogDescription>
            Set up a new multisig wallet with multiple owners and approval threshold
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <Label htmlFor="name">Multisig Name *</Label>
            <Input 
              id="name"
              placeholder="e.g., Operations Treasury"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="threshold">Approval Threshold *</Label>
              <Input 
                id="threshold"
                type="number"
                min="1"
                max={owners.filter(o => o.trim()).length}
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">
                Number of signatures required
              </p>
            </div>

            <div>
              <Label htmlFor="balance">Initial Balance (Optional)</Label>
              <Input 
                id="balance"
                type="number"
                step="0.000001"
                placeholder="0.00"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Owner Addresses *</Label>
              <Button 
                type="button" 
                size="sm" 
                variant="outline" 
                onClick={handleAddOwner}
                className="gap-2"
              >
                <Plus className="w-3 h-3" />
                Add Owner
              </Button>
            </div>
            
            <div className="space-y-2">
              {owners.map((owner, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    placeholder={`Owner ${index + 1} address`}
                    value={owner}
                    onChange={(e) => handleOwnerChange(index, e.target.value)}
                    className="font-mono"
                  />
                  {owners.length > 2 && (
                    <Button 
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveOwner(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              At least 2 owners required
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-blue-900">
              This will create a multisig requiring{' '}
              <span className="font-semibold">{threshold}</span> out of{' '}
              <span className="font-semibold">{owners.filter(o => o.trim()).length}</span> signatures
              to approve transactions.
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Multisig
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
