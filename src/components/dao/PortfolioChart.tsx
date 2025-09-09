import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const portfolioData = [
  { name: "Stablecoins", value: 45, color: "#1e40af" },
  { name: "DeFi Tokens", value: 25, color: "#3b82f6" },
  { name: "Blue Chips", value: 20, color: "#60a5fa" },
  { name: "Treasury Bills", value: 10, color: "#93c5fd" },
];

export const PortfolioChart = () => {
  return (
    <Card className="shadow-card border-navy-light/20">
      <CardHeader>
        <CardTitle className="text-navy-primary">Asset Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={portfolioData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {portfolioData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};