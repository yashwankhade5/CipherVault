import { MoreHorizontal, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import  type { Transaction } from '../typescipervault';
import { toast } from 'sonner';
import  { PublicKey } from "@solana/web3.js";

interface TransactionTableProps {
  transactions: Transaction[];
  onApproveTransaction: (txId: string) => void;
  onExecuteTransaction: (txId: string) => void;
  onRejectTransaction?: (txId: string) => void;
  connectedWallet: PublicKey | null;
  compact?: boolean;
}

export function TransactionTable({ 
  transactions, 
  onApproveTransaction, 
  onExecuteTransaction,
  onRejectTransaction,
  connectedWallet,
  compact = false 
}: TransactionTableProps) {
  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const handleApprove = (txId: string) => {
    onApproveTransaction(txId);
    toast.success('Transaction approved successfully');
  };

  const handleExecute = (txId: string) => {
    onExecuteTransaction(txId);
    toast.success('Transaction executed successfully');
  };

  const handleReject = (txId: string) => {
    if (onRejectTransaction) {
      onRejectTransaction(txId);
      toast.error('Transaction rejected');
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Clock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
        <p>No transactions found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction ID</TableHead>
          {!compact && <TableHead>Multisig</TableHead>}
          <TableHead>Recipient</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Approvals</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => {
let hasApproved 
          if (connectedWallet){
           hasApproved  = tx.approvedBy.includes(connectedWallet);
          }
          
          const canExecute = tx.status === 'ready';
          const canApprove = tx.status === 'pending' && !hasApproved;
          
          return (
            <TableRow key={tx.id}>
              <TableCell className="font-mono text-sm">{tx.id}</TableCell>
              {!compact && <TableCell>{tx.multisigName}</TableCell>}
              <TableCell className="font-mono text-sm">{tx.recipient}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{tx.amount}</span>
                  <Badge variant="outline">{tx.token}</Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Progress value={(tx.approvals / tx.threshold) * 100} className="w-20 h-2" />
                    <span className="text-sm text-slate-600">{tx.approvals}/{tx.threshold}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {tx.status === 'ready' && (
                  <Badge className="bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                    <Zap className="w-3 h-3" />
                    Ready to Execute
                  </Badge>
                )}
                {tx.status === 'pending' && (
                  <Badge variant="outline" className="flex items-center gap-1 w-fit">
                    <Clock className="w-3 h-3" />
                    Pending
                  </Badge>
                )}
                {tx.status === 'executed' && (
                  <Badge className="bg-slate-100 text-slate-700 flex items-center gap-1 w-fit">
                    <CheckCircle className="w-3 h-3" />
                    Executed
                  </Badge>
                )}
                {tx.status === 'rejected' && (
                  <Badge variant="outline" className="border-red-200 text-red-700 flex items-center gap-1 w-fit">
                    <XCircle className="w-3 h-3" />
                    Rejected
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-slate-600">{formatTimeAgo(tx.createdAt)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {canExecute ? (
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleExecute(tx.id)}
                    >
                      Execute
                    </Button>
                  ) : canApprove ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleApprove(tx.id)}
                    >
                      Approve
                    </Button>
                  ) : hasApproved && tx.status === 'pending' ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approved
                    </Badge>
                  ) : null}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Copy Transaction PDA</DropdownMenuItem>
                      <DropdownMenuItem>Copy Recipient Address</DropdownMenuItem>
                      {onRejectTransaction && tx.status === 'pending' && (
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleReject(tx.id)}
                        >
                          Reject Transaction
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
