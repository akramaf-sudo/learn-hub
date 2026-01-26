import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, BookOpen, FileText, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { useLanguage } from "@/contexts/LanguageContext";

export function ProgressCard() {
  const { t } = useLanguage();
  const { data: statsData } = useQuery({
    queryKey: ["training-stats"],
    queryFn: async () => {
      const { data: videos, error } = await supabase
        .from("training_videos")
        .select("category");

      if (error) throw error;

      const uniqueCategories = new Set(videos?.map((v) => v.category)).size;
      return {
        videoCount: videos?.length || 0,
        categoryCount: uniqueCategories || 0,
      };
    },
  });

  const stats = [
    { label: t("progress.videos"), value: (statsData?.videoCount || 0).toString(), icon: <Video className="w-4 h-4 text-primary" /> },
    { label: t("progress.guides"), value: "0", icon: <BookOpen className="w-4 h-4 text-chart-1" /> },
    { label: t("progress.procedures"), value: "0", icon: <FileText className="w-4 h-4 text-secondary" /> },
    { label: t("progress.categories"), value: (statsData?.categoryCount || 0).toString(), icon: <TrendingUp className="w-4 h-4 text-chart-2" /> },
  ];

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-card-foreground">{t("progress.title")}</CardTitle>
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
