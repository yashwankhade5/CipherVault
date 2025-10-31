import { Shield, BarChart3, FileText, Wallet, Settings } from 'lucide-react';
import type { TabType } from '../App';
import { useWallet } from '@solana/wallet-adapter-react';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  // connectedWallet: string;
  onDisconnect: () => void;
}

export function Sidebar({ activeTab, setActiveTab,  onDisconnect }: SidebarProps) {
  const wallet = useWallet();
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-purple-400" />
          <span className="font-semibold">CipherVault</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'overview' ? 'bg-purple-600' : 'hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'transactions' ? 'bg-purple-600' : 'hover:bg-slate-800'
            }`}
          >
            <FileText className="w-5 h-5" />
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('multisigs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'multisigs' ? 'bg-purple-600' : 'hover:bg-slate-800'
            }`}
          >
            <Wallet className="w-5 h-5" />
            Multisigs
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'settings' ? 'bg-purple-600' : 'hover:bg-slate-800'
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-4 mb-3">
          <div className="text-xs text-slate-400 mb-1">Connected Wallet</div>
          <div className="text-sm font-mono">{wallet.publicKey?.toString().substring(0,20).concat("....")}</div>
        </div>
        <button
          onClick={onDisconnect}
          className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          {wallet.disconnecting ? "disconnecting": "Disconnect Wallet"}
        </button>
      </div>
    </div>
  );
}
