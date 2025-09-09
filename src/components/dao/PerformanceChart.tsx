import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const performanceData = [
  { month: "Jan", value: 1000000 },
  { month: "Feb", value: 1050000 },
  { month: "Mar", value: 1120000 },
  { month: "Apr", value: 1080000 },
  { month: "May", value: 1200000 },
  { month: "Jun", value: 1350000 },
  { month: "Jul", value: 1280000 },
  { month: "Aug", value: 1420000 },
];

export const PerformanceChart = () => {
  return (
    <Card className="shadow-card border-navy-light/20">
      <CardHeader>
        <CardTitle className="text-navy-primary">Treasury Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis 
              stroke="#6b7280"
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Treasury Value"]}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#1e40af" 
              strokeWidth={3}
              dot={{ fill: "#1e40af", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};