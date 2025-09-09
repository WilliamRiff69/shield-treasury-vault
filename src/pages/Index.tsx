import { Header } from "@/components/dao/Header";
import { MetricsCard } from "@/components/dao/MetricsCard";
import { PortfolioChart } from "@/components/dao/PortfolioChart";
import { PerformanceChart } from "@/components/dao/PerformanceChart";
import { TransactionsTable } from "@/components/dao/TransactionsTable";
import { Wallet, TrendingUp, DollarSign, PieChart, Shield } from "lucide-react";
import { useTreasuryVault } from "@/hooks/useTreasuryVault";
import { useAccount } from "wagmi";

const Index = () => {
  const { isConnected, isMember, memberInfo } = useTreasuryVault();
  const { address } = useAccount();

  // Mock data - In a real implementation, this would come from FHE decryption
  const mockMetrics = {
    totalValue: "$1.42M",
    monthlyReturn: "8.3%",
    assetsCount: "24",
    yieldGenerated: "$47.2K"
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-light">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Shield className="h-16 w-16 text-navy-primary mb-4" />
            <h2 className="text-2xl font-bold text-navy-primary mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Connect your wallet to access the Shield Treasury Vault
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!isMember) {
    return (
      <div className="min-h-screen bg-gradient-light">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Shield className="h-16 w-16 text-navy-primary mb-4" />
            <h2 className="text-2xl font-bold text-navy-primary mb-2">Access Restricted</h2>
            <p className="text-muted-foreground mb-6">
              You are not a verified DAO member. Contact the treasury manager for access.
            </p>
            <div className="bg-navy-light/10 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Your address: {address}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-light">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Member Status */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Verified DAO Member
            </span>
            {memberInfo?.isVerified && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Total Treasury Value"
            value={mockMetrics.totalValue}
            change="+12.5% from last month"
            changeType="positive"
            icon={Wallet}
          />
          <MetricsCard
            title="Monthly Returns"
            value={mockMetrics.monthlyReturn}
            change="+2.1% vs target"
            changeType="positive"
            icon={TrendingUp}
          />
          <MetricsCard
            title="Assets Under Management"
            value={mockMetrics.assetsCount}
            change="3 new positions"
            changeType="neutral"
            icon={PieChart}
          />
          <MetricsCard
            title="Yield Generated"
            value={mockMetrics.yieldGenerated}
            change="+15.8% this month"
            changeType="positive"
            icon={DollarSign}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PortfolioChart />
          <PerformanceChart />
        </div>

        {/* Transactions Table */}
        <div className="mb-8">
          <TransactionsTable />
        </div>

        {/* Footer */}
        <div className="text-center py-6 border-t border-navy-light/20">
          <p className="text-muted-foreground text-sm">
            Treasury data is encrypted using Fully Homomorphic Encryption (FHE) • 
            Accessible only to verified DAO members
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;