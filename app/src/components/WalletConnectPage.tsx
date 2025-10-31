import { Shield, Wallet, Users, Lock, ArrowRight} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from "@solana/web3.js";

interface WalletConnectPageProps {
  onConnect: (wallet: PublicKey) => void;
}

export function WalletConnectPage({ onConnect }: WalletConnectPageProps) {
  const wallet = useWallet();
  const handleConnect = () => {
  
    if (wallet.publicKey) {
      onConnect(wallet.publicKey);
    }
    
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
            <span className="text-white font-semibold">CipherVault</span>
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
           <div className="[&_button]:!bg-purple-600 [&_button:hover]:!bg-purple-700 [&_button]:!text-white [&_button]:!gap-2 [&_button]:!h-12 [&_button]:!px-8 [&_button]:!text-lg [&_button]:!rounded-lg [&_button]:w-60 [&_button]:p-1">
            <WalletMultiButton onClick={handleConnect}>{wallet.connecting?"":<Wallet className="w-5 h-5" />}Connect Now  {wallet.connecting?"":<ArrowRight className="w-4 h-4" />} </WalletMultiButton></div>
            
            <Button 
              size="lg"
              variant="outline"
              className="border-white/20  hover:bg-white/10 h-12 px-8"
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
            <div className="[&_button]:!bg-white 
                [&_button]:!text-purple-600 
                [&_button:hover]:!bg-slate-100 
                [&_button]:!gap-2 
                [&_button]:!h-12 
                [&_button]:!px-8 
                [&_button]:!text-sm 
                [&_button]:!rounded-lg 
                [&_button]:!flex 
                [&_button]:!items-center 
                [&_button]:!justify-center">
  <WalletMultiButton >{wallet.connecting?"":<Wallet className="w-5 h-5" />} Connect Wallet Now</WalletMultiButton>
</div>

            
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
