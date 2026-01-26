import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export function FeaturedContent() {
  const navigate = useNavigate();
  
  const { data: videos, isLoading } = useQuery({
    queryKey: ["featured-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_videos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Featured Training</h2>
            <p className="text-muted">Latest training content</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border bg-card overflow-hidden">
              <Skeleton className="w-full h-40" />
              <CardContent className="p-5">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Featured Training</h2>
            <p className="text-muted">Latest training content</p>
          </div>
        </div>
        <Card className="border-border bg-card p-8 text-center">
          <p className="text-muted">No training content available yet. Check back soon!</p>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Featured Training</h2>
          <p className="text-muted">Latest training content</p>
        </div>
        <button 
          className="text-sm text-primary hover:underline"
          onClick={() => navigate("/videos")}
        >
          See all videos
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card 
            key={video.id} 
            className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card"
            onClick={() => navigate("/videos")}
          >
            <div className="relative overflow-hidden bg-muted h-40 flex items-center justify-center">
              {video.thumbnail_url ? (
                <img 
                  src={video.thumbnail_url} 
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <Play className="w-12 h-12 text-muted-foreground/50" />
              )}
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                {video.category}
              </Badge>
            </div>
            <CardContent className="p-5">
              <h3 className="font-semibold text-card-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                {video.title}
              </h3>
              <p className="text-sm text-muted mb-4 line-clamp-2">
                {video.description || "No description available"}
              </p>
              <div className="flex items-center text-xs text-muted">
                {video.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {video.duration}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
