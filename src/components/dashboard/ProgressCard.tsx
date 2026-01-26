import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, BookOpen, FileText, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function ProgressCard() {
  const { data: videoCount = 0 } = useQuery({
    queryKey: ["video-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("training_videos")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return count || 0;
    },
  });

  const stats = [
    { label: "Videos", value: videoCount.toString(), icon: <Video className="w-4 h-4 text-primary" /> },
    { label: "Guides", value: "0", icon: <BookOpen className="w-4 h-4 text-chart-1" /> },
    { label: "Procedures", value: "0", icon: <FileText className="w-4 h-4 text-secondary" /> },
    { label: "Categories", value: "8", icon: <TrendingUp className="w-4 h-4 text-chart-2" /> },
  ];

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-card-foreground">Training Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
