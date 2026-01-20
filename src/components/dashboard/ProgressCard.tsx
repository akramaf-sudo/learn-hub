import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Clock, Flame } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export function ProgressCard() {
  const stats: StatItem[] = [
    { label: "Completed", value: "12", icon: <Trophy className="w-4 h-4 text-chart-1" /> },
    { label: "In Progress", value: "3", icon: <Target className="w-4 h-4 text-primary" /> },
    { label: "Hours Learned", value: "24", icon: <Clock className="w-4 h-4 text-secondary" /> },
    { label: "Day Streak", value: "5", icon: <Flame className="w-4 h-4 text-destructive" /> },
  ];

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-card-foreground">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted">Overall Completion</span>
            <span className="font-medium text-card-foreground">68%</span>
          </div>
          <Progress value={68} className="h-2" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-accent rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                {stat.icon}
                <span className="text-xs text-muted">{stat.label}</span>
              </div>
              <span className="text-2xl font-bold text-card-foreground">{stat.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
