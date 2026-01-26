import { MainLayout } from "@/components/layout/MainLayout";
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
import { TrainingCategoryCard } from "@/components/dashboard/TrainingCategoryCard";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { RecentTraining } from "@/components/dashboard/RecentTraining";
import { FeaturedContent } from "@/components/dashboard/FeaturedContent";
import { Video, BookOpen, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";

import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const { t } = useLanguage();

  const categories = [
    {
      id: "videos",
      title: t("dashboard.videoTutorials"),
      description: t("dashboard.videoDesc"),
      icon: Video,
      color: "primary" as const,
      url: "/videos",
    },
    {
      id: "guides",
      title: t("dashboard.writtenGuides"),
      description: t("dashboard.guideDesc"),
      icon: BookOpen,
      color: "accent" as const,
      url: "/guides",
    },
    {
      id: "procedures",
      title: t("dashboard.procedures"),
      description: t("dashboard.procDesc"),
      icon: FileText,
      color: "secondary" as const,
      url: "/procedures",
    },
  ];

  const visibleCategories = categories.filter(category =>
    isAdmin || category.id === "videos"
  );

  return (
    <MainLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-8">
        {/* Welcome Hero */}
        <WelcomeHero />

        {/* Categories Grid */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">{t("dashboard.browseCategory")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleCategories.map((category) => (
              <TrainingCategoryCard
                key={category.id}
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

        {/* Featured Content - Only for admins if it contains mixed content, or keep if generic */}
        {isAdmin && <FeaturedContent />}
      </div>
    </MainLayout>
  );
};

export default Index;
