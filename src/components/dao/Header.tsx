import { Shield } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export const Header = () => {
  const { isConnected } = useAccount();

  return (
    <header className="w-full bg-gradient-navy shadow-corporate">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Shield Treasury Vault</h1>
              <p className="text-navy-light text-sm">FHE Protected Data</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            {isConnected ? (
              <div className="text-right">
                <p className="text-white text-sm font-medium">Member Access</p>
                <p className="text-navy-light text-xs">Authenticated</p>
              </div>
            ) : null}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};