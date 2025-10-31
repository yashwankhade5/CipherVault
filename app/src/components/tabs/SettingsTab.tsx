import { Copy, ExternalLink, Shield, Bell, Database } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';
import { useProgram} from "../../anchor/setup";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';


interface SettingsTabProps {
  
  onDisconnect: () => void;
}

export function SettingsTab({ onDisconnect }: SettingsTabProps) {
const program = useProgram()
  const {connection}=useConnection()
  const wallet =useWallet()
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('Copied to clipboard');
      } catch (err) {
        toast.error('Failed to copy to clipboard');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Manage your account and application preferences</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Wallet Connection */}
        <Card className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-slate-900 mb-1">Connected Wallet</h3>
              <p className="text-sm text-slate-600">Your wallet address on Solana mainnet</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="font-mono text-sm text-slate-900">{wallet.publicKey?.toBase58()}</div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => handleCopy(wallet.publicKey?.toBase58() as string)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
            onClick={onDisconnect}
          >
            Disconnect Wallet
          </Button>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-slate-900 mb-1">Notifications</h3>
              <p className="text-sm text-slate-600">Configure how you receive notifications</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>New transactions</Label>
                <p className="text-sm text-slate-600">Get notified when a new transaction is created</p>
              </div>
              <Switch disabled  />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Approval requests</Label>
                <p className="text-sm text-slate-600">Get notified when your approval is needed</p>
              </div>
              <Switch disabled  />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Transaction executed</Label>
                <p className="text-sm text-slate-600">Get notified when a transaction is executed</p>
              </div>
              <Switch disabled  />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Email notifications</Label>
                <p className="text-sm text-slate-600">Receive notifications via email</p>
              </div>
              <Switch disabled />
            </div>
          </div>
        </Card>

        {/* Network Settings */}
        <Card className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Database className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-slate-900 mb-1">Network Settings</h3>
              <p className="text-sm text-slate-600">Configure Solana network connection</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">RPC Endpoint</Label>
              <div className="bg-slate-50 rounded-lg p-3 font-mono text-sm text-slate-700">
                {connection.rpcEndpoint}
               
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Network</Label>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-700">{connection.rpcEndpoint=="https://api.mainnet-beta.solana.com" ? "Mainnet Beta":connection.rpcEndpoint == "https://api.devnet.solana.com"? "Devnet":connection.rpcEndpoint.includes("127.0.0.1:") ? "Localhost":connection.rpcEndpoint}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="p-6 bg-slate-50 border-slate-200">
          <div className="text-sm text-slate-600 space-y-2">
            <div className="flex justify-between">
              <span>Version</span>
              <span className="text-slate-900 font-mono">2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span>Program ID</span>
              <span className="text-slate-900 font-mono text-xs"> {program?.programId.toBase58()}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
