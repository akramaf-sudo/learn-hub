import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, FileText, BookOpen } from "lucide-react";

interface TrainingItem {
  id: string;
  title: string;
  type: "video" | "guide" | "procedure";
  progress: number;
  duration: string;
}

const recentItems: TrainingItem[] = [
  { id: "1", title: "Introduction to CRM System", type: "video", progress: 75, duration: "15 min" },
  { id: "2", title: "Data Entry Best Practices", type: "guide", progress: 40, duration: "10 min read" },
  { id: "3", title: "Customer Onboarding Process", type: "procedure", progress: 100, duration: "8 steps" },
  { id: "4", title: "Report Generation Tutorial", type: "video", progress: 0, duration: "20 min" },
];

const typeConfig = {
  video: { icon: Play, color: "bg-primary/10 text-primary", label: "Video" },
  guide: { icon: BookOpen, color: "bg-chart-1/10 text-chart-1", label: "Guide" },
  procedure: { icon: FileText, color: "bg-secondary/10 text-secondary", label: "Procedure" },
};

export function RecentTraining() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground">Recent Training</CardTitle>
          <button className="text-sm text-primary hover:underline">View all</button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentItems.map((item) => {
            const config = typeConfig[item.type];
            const Icon = config.icon;
            
            return (
              <div 
                key={item.id} 
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-card-foreground truncate group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {config.label}
                    </Badge>
                    <span className="text-xs text-muted">{item.duration}</span>
                  </div>
                </div>
                <div className="w-20 hidden sm:block">
                  <Progress value={item.progress} className="h-1.5" />
                  <span className="text-xs text-muted">{item.progress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
