import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

const transactions = [
  {
    id: "1",
    type: "investment",
    asset: "USDC",
    amount: 250000,
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "2",
    type: "withdrawal",
    asset: "ETH",
    amount: -45000,
    date: "2024-01-14",
    status: "completed",
  },
  {
    id: "3",
    type: "investment",
    asset: "AAVE",
    amount: 80000,
    date: "2024-01-13",
    status: "pending",
  },
  {
    id: "4",
    type: "investment",
    asset: "UNI",
    amount: 120000,
    date: "2024-01-12",
    status: "completed",
  },
];

export const TransactionsTable = () => {
  return (
    <Card className="shadow-card border-navy-light/20">
      <CardHeader>
        <CardTitle className="text-navy-primary">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border border-navy-light/20 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${transaction.amount > 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  {transaction.amount > 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-navy-primary">{transaction.asset}</p>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${transaction.amount > 0 ? 'text-success' : 'text-destructive'}`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                </p>
                <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};