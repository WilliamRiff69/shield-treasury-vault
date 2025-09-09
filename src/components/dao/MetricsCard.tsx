import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

export const MetricsCard = ({ title, value, change, changeType, icon: Icon }: MetricsCardProps) => {
  const changeColor = {
    positive: "text-success",
    negative: "text-destructive",
    neutral: "text-muted-foreground",
  }[changeType];

  return (
    <Card className="shadow-card border-navy-light/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-navy-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-navy-primary">{value}</div>
        <p className={`text-xs ${changeColor} mt-1`}>
          {change}
        </p>
      </CardContent>
    </Card>
  );
};