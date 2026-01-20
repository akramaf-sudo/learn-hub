import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star } from "lucide-react";

interface FeaturedItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  enrollments: number;
  rating: number;
  isNew?: boolean;
}

const featuredItems: FeaturedItem[] = [
  {
    id: "1",
    title: "Complete CRM Mastery Course",
    description: "Learn everything about our customer relationship management system",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    duration: "2h 30min",
    enrollments: 234,
    rating: 4.8,
    isNew: true,
  },
  {
    id: "2",
    title: "Project Management Essentials",
    description: "Master our internal project tracking and collaboration tools",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop",
    duration: "1h 45min",
    enrollments: 189,
    rating: 4.6,
  },
  {
    id: "3",
    title: "Data Analytics Dashboard",
    description: "Understanding and utilizing our business intelligence tools",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    duration: "3h 15min",
    enrollments: 156,
    rating: 4.9,
  },
];

export function FeaturedContent() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Featured Training</h2>
          <p className="text-muted">Most popular courses this month</p>
        </div>
        <button className="text-sm text-primary hover:underline">See all courses</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredItems.map((item) => (
          <Card 
            key={item.id} 
            className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card"
          >
            <div className="relative overflow-hidden">
              <img 
                src={item.thumbnail} 
                alt={item.title}
                className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {item.isNew && (
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                  New
                </Badge>
              )}
            </div>
            <CardContent className="p-5">
              <h3 className="font-semibold text-card-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-muted mb-4 line-clamp-2">
                {item.description}
              </p>
              <div className="flex items-center justify-between text-xs text-muted">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {item.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {item.enrollments}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-chart-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {item.rating}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
