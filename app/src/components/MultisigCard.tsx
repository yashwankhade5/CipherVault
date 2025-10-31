import {  Users } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import type { Multisig } from '../utilis/vault-types';

interface MultisigCardProps {
  multisig: Multisig;
}

export function MultisigCard({ multisig }: MultisigCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-slate-900 mb-1">{multisig.name}</h3>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users className="w-4 h-4" />
            {multisig.owners.length} owners · {multisig.threshold}/{multisig.owners.length} threshold
          </div>
        </div>
        {multisig.txPending > 0 && (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            {multisig.txPending} pending
          </Badge>
        )}
      </div>
      
      <div className="bg-slate-50 rounded-lg p-4 mb-4">
        <div className="text-sm text-slate-600 mb-1">Balance</div>
        <div className="text-slate-900">{multisig.balance} {multisig.currency}</div>
      </div>

      <Button variant="outline" className="w-full">View Details</Button>
    </Card>
  );
}
