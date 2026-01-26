import { MainLayout } from "@/components/layout/MainLayout";
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
import { TrainingCategoryCard } from "@/components/dashboard/TrainingCategoryCard";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { RecentTraining } from "@/components/dashboard/RecentTraining";
import { FeaturedContent } from "@/components/dashboard/FeaturedContent";
import { Video, BookOpen, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

const categories = [
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video guides on all our tools",
      icon: Video,
      color: "primary" as const,
      url: "/videos",
    },
    {
      title: "Written Guides",
      description: "Detailed documentation and how-to articles",
      icon: BookOpen,
      color: "accent" as const,
      url: "/guides",
    },
    {
      title: "Procedures",
      description: "Standard operating procedures and workflows",
      icon: FileText,
      color: "secondary" as const,
      url: "/procedures",
    },
  ];

  return (
    <MainLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-8">
        {/* Welcome Hero */}
        <WelcomeHero />

        {/* Categories Grid */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <TrainingCategoryCard
                key={category.title}
                {...category}
                onClick={() => navigate(category.url)}
              />
            ))}
          </div>
        </section>

        {/* Progress and Recent Training */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentTraining />
          </div>
          <div>
            <ProgressCard />
          </div>
        </div>

        {/* Featured Content */}
        <FeaturedContent />
      </div>
    </MainLayout>
  );
};

export default Index;
