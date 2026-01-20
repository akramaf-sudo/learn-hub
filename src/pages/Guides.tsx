import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Clock, ArrowRight, Filter } from "lucide-react";
import { useState } from "react";

interface GuideItem {
  id: string;
  title: string;
  description: string;
  readTime: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const guides: GuideItem[] = [
  {
    id: "1",
    title: "Complete Guide to Customer Management",
    description: "Everything you need to know about managing customer relationships effectively",
    readTime: "15 min",
    category: "CRM",
    difficulty: "Beginner",
  },
  {
    id: "2",
    title: "Data Analysis Best Practices",
    description: "Learn how to analyze data and create meaningful insights for your team",
    readTime: "20 min",
    category: "Analytics",
    difficulty: "Intermediate",
  },
  {
    id: "3",
    title: "Workflow Automation Guide",
    description: "Automate repetitive tasks and improve your productivity",
    readTime: "12 min",
    category: "Automation",
    difficulty: "Advanced",
  },
  {
    id: "4",
    title: "Communication Tools Overview",
    description: "Master internal communication tools for better collaboration",
    readTime: "8 min",
    category: "Communication",
    difficulty: "Beginner",
  },
  {
    id: "5",
    title: "Document Management System",
    description: "Organize, store, and retrieve documents efficiently",
    readTime: "10 min",
    category: "Documents",
    difficulty: "Beginner",
  },
  {
    id: "6",
    title: "Advanced Search Techniques",
    description: "Find what you need faster with these powerful search methods",
    readTime: "7 min",
    category: "Productivity",
    difficulty: "Intermediate",
  },
];

const difficultyColors = {
  Beginner: "bg-chart-1/10 text-chart-1",
  Intermediate: "bg-primary/10 text-primary",
  Advanced: "bg-secondary/10 text-secondary",
};

const Guides = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGuides = guides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Written Guides</h1>
          <p className="text-muted">Comprehensive documentation and how-to articles</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input
              placeholder="Search guides..."
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

        {/* Guides List */}
        <div className="grid gap-4">
          {filteredGuides.map((guide) => (
            <Card
              key={guide.id}
              className="group cursor-pointer hover:shadow-md transition-all duration-300 border-border bg-card"
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-chart-1/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-chart-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {guide.category}
                    </Badge>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[guide.difficulty]}`}>
                      {guide.difficulty}
                    </span>
                  </div>
                  <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-1">{guide.description}</p>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                  <span className="text-sm text-muted flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {guide.readTime}
                  </span>
                  <ArrowRight className="w-5 h-5 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted">No guides found matching your search.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Guides;
