import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, Play, Clock, Filter, Loader2, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  duration: string | null;
  category: string;
  created_at: string;
}

const Videos = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const { data: videos, isLoading } = useQuery({
    queryKey: ["training-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Video[];
    },
  });

  const filteredVideos = (videos || []).filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Video Tutorials</h1>
          <p className="text-muted">Watch and learn with our comprehensive video library</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Video Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Card
                key={video.id}
                className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 border-border bg-card"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={video.thumbnail_url || "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=225&fit=crop"}
                    alt={video.title}
                    className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100">
                      <Play className="w-6 h-6 text-primary-foreground ml-1" />
                    </div>
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-foreground/80 text-background text-xs rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {video.duration}
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {video.category}
                  </Badge>
                  <h3 className="font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2">{video.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted">No videos found. {videos?.length === 0 && "Ask an admin to upload training videos."}</p>
          </div>
        )}

        {/* Video Player Dialog */}
        <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
          <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
            <DialogHeader className="p-4 pb-0">
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-xl">{selectedVideo?.title}</DialogTitle>
                  <DialogDescription className="mt-1">
                    <Badge variant="secondary" className="mr-2">
                      {selectedVideo?.category}
                    </Badge>
                    {selectedVideo?.duration && (
                      <span className="text-xs text-muted">{selectedVideo.duration}</span>
                    )}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="p-4 pt-2">
              {selectedVideo && (
                <div className="rounded-lg overflow-hidden bg-black">
                  <video
                    controls
                    autoPlay
                    className="w-full aspect-video"
                    src={selectedVideo.video_url}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              {selectedVideo?.description && (
                <p className="mt-4 text-sm text-muted">{selectedVideo.description}</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Videos;
