import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Play, Clock, Filter } from "lucide-react";
import { useState } from "react";

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
  isCompleted?: boolean;
}

const videos: VideoItem[] = [
  {
    id: "1",
    title: "Getting Started with CRM",
    description: "Learn the basics of our customer relationship management system",
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=225&fit=crop",
    duration: "12:30",
    category: "CRM",
    isCompleted: true,
  },
  {
    id: "2",
    title: "Advanced Reporting Features",
    description: "Master the art of creating comprehensive reports and dashboards",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
    duration: "18:45",
    category: "Analytics",
  },
  {
    id: "3",
    title: "Team Collaboration Tools",
    description: "Discover how to collaborate effectively with your team",
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=225&fit=crop",
    duration: "15:20",
    category: "Collaboration",
  },
  {
    id: "4",
    title: "Email Integration Setup",
    description: "Connect your email accounts for seamless communication",
    thumbnail: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=225&fit=crop",
    duration: "8:15",
    category: "Email",
  },
  {
    id: "5",
    title: "Project Management Basics",
    description: "Learn to manage projects efficiently from start to finish",
    thumbnail: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=400&h=225&fit=crop",
    duration: "22:00",
    category: "Projects",
  },
  {
    id: "6",
    title: "Security Best Practices",
    description: "Keep your data safe with these essential security tips",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=225&fit=crop",
    duration: "10:45",
    category: "Security",
  },
];

const Videos = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = videos.filter(
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card
              key={video.id}
              className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 border-border bg-card"
            >
              <div className="relative overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100">
                    <Play className="w-6 h-6 text-primary-foreground ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-foreground/80 text-background text-xs rounded flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {video.duration}
                </div>
                {video.isCompleted && (
                  <Badge className="absolute top-2 left-2 bg-chart-1 text-primary-foreground">
                    Completed
                  </Badge>
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

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted">No videos found matching your search.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Videos;
