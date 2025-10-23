import { Shield, Wallet, Users, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

interface WalletConnectPageProps {
  onConnect: (wallet: string) => void;
}

export function WalletConnectPage({ onConnect }: WalletConnectPageProps) {
  const handleConnect = () => {
    // In production, this would integrate with Phantom, Solflare, etc.
    // For now, we'll simulate a wallet connection
    const mockWallet = '7xK9p3xY2pmL3p';
    onConnect(mockWallet);
  };

  const features = [
    {
      icon: Shield,
      title: 'Multi-Signature Security',
      description: 'Require multiple approvals for transactions to enhance security',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Manage treasury with your team through transparent approval workflows',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Lock,
      title: 'On-Chain Security',
      description: 'All transactions are secured by Solana blockchain smart contracts',
      color: 'bg-green-100 text-green-600',
    },
  ];

  const steps = [
    'Connect your Solana wallet',
    'Create or join a multisig',
    'Propose and approve transactions',
    'Execute with threshold signatures',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-400" />
            <span className="text-white font-semibold">MultiSig Treasury</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-purple-300 text-sm">Powered by Solana</span>
          </div>
          
          <h1 className="text-white mb-6 text-5xl">
            Secure Multi-Signature
            <br />
            Treasury Management
          </h1>
          
          <p className="text-slate-300 text-xl max-w-2xl mx-auto mb-8">
            Protect your organization's funds with multi-signature wallets. 
            Require multiple approvals for every transaction on Solana.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button 
              onClick={handleConnect}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white gap-2 h-12 px-8"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 h-12 px-8"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-8 mb-16">
          {features.map((feature, i) => (
            <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-sm p-8">
              <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-white mb-4">How It Works</h2>
            <p className="text-slate-300">Get started in minutes with our streamlined process</p>
          </div>

          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mb-4">
                    {i + 1}
                  </div>
                  <p className="text-slate-300">{step}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute top-6 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-purple-500 to-purple-500/20"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-white text-4xl mb-2">100%</div>
            <div className="text-slate-400">On-Chain Security</div>
          </div>
          <div className="text-center">
            <div className="text-white text-4xl mb-2">Multi-Sig</div>
            <div className="text-slate-400">Customizable Thresholds</div>
          </div>
          <div className="text-center">
            <div className="text-white text-4xl mb-2">Instant</div>
            <div className="text-slate-400">Transaction Execution</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12">
            <h2 className="text-white mb-4">Ready to Secure Your Treasury?</h2>
            <p className="text-white/90 mb-8 text-lg">
              Connect your wallet and start managing your multisig in minutes
            </p>
            <Button 
              onClick={handleConnect}
              size="lg"
              className="bg-white text-purple-600 hover:bg-slate-100 gap-2 h-12 px-8"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet Now
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-slate-500 text-sm">
            MultiSig Treasury dApp · Built on Solana · Secure & Decentralized
          </p>
        </div>
      </div>
    </div>
  );
}
