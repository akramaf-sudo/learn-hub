import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export function RecentTraining() {
  const navigate = useNavigate();
  
  const { data: videos, isLoading } = useQuery({
    queryKey: ["recent-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_videos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground">Recent Training</CardTitle>
          <button 
            className="text-sm text-primary hover:underline"
            onClick={() => navigate("/videos")}
          >
            View all
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : videos && videos.length > 0 ? (
          <div className="space-y-4">
            {videos.map((video) => (
              <div 
                key={video.id} 
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group"
                onClick={() => navigate("/videos")}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                  <Play className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-card-foreground truncate group-hover:text-primary transition-colors">
                    {video.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {video.category}
                    </Badge>
                    {video.duration && (
                      <span className="text-xs text-muted">{video.duration}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-muted">
            No training videos available yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
