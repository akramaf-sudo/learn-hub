import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Target, Clock, Award, Play, BookOpen, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LearningItem {
  id: string;
  title: string;
  type: "video" | "guide" | "procedure";
  progress: number;
  totalDuration: string;
  category: string;
}

const typeConfig = {
  video: { icon: Play, color: "bg-primary/10 text-primary" },
  guide: { icon: BookOpen, color: "bg-chart-1/10 text-chart-1" },
  procedure: { icon: FileText, color: "bg-secondary/10 text-secondary" },
};

import { useLanguage } from "@/contexts/LanguageContext";

const MyLearning = () => {
  const { t } = useLanguage();
  const { data: videos, isLoading } = useQuery({
    queryKey: ["my-learning-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const inProgressItems: LearningItem[] = (videos || []).map((video: any) => ({
    id: video.id,
    title: video.title,
    type: "video",
    progress: 0, // Default to 0 until progress tracking is implemented
    totalDuration: video.duration || "N/A",
    category: video.category
  }));

  const completedItems: LearningItem[] = []; // Empty for now
  const achievements = [
    { title: "First Course", description: "Complete your first training", icon: Trophy, earned: false },
    { title: "Quick Learner", description: "Complete 5 trainings in a week", icon: Target, earned: false },
  ];

  return (
    <MainLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t("myLearning.title")}</h1>
          <p className="text-muted">{t("myLearning.subtitle")}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-chart-1/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-chart-1" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{completedItems.length}</p>
                  <p className="text-xs text-muted">{t("myLearning.completed")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{inProgressItems.length}</p>
                  <p className="text-xs text-muted">{t("myLearning.inProgress")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">0h</p>
                  <p className="text-xs text-muted">{t("myLearning.timeSpent")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">0</p>
                  <p className="text-xs text-muted">{t("myLearning.achievements")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="training" className="space-y-4">
          <TabsList className="bg-accent">
            <TabsTrigger value="training">{t("myLearning.trainingLibrary")}</TabsTrigger>
            <TabsTrigger value="completed">{t("myLearning.completed")}</TabsTrigger>
            <TabsTrigger value="achievements">{t("myLearning.achievements")}</TabsTrigger>
          </TabsList>

          <TabsContent value="training" className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : inProgressItems.length > 0 ? (
              inProgressItems.map((item) => {
                const config = typeConfig[item.type];
                const Icon = config.icon;

                return (
                  <Card key={item.id} className="group cursor-pointer hover:shadow-md transition-all border-border bg-card">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          <Badge variant="outline" className="text-xs">{item.category}</Badge>
                        </div>
                        <p className="text-sm text-muted">{item.totalDuration}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <Progress value={item.progress} className="h-2 flex-1" />
                          <span className="text-sm font-medium text-card-foreground">{item.progress}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12 text-muted">{t("myLearning.noContent")}</div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="text-center py-12 text-muted">{t("myLearning.noCompleted")}</div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.title}
                  className={`border-border ${achievement.earned ? "bg-card" : "bg-accent/50 opacity-60"}`}
                >
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${achievement.earned ? "bg-chart-1/20" : "bg-muted/20"
                      }`}>
                      <achievement.icon className={`w-7 h-7 ${achievement.earned ? "text-chart-1" : "text-muted"}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">{achievement.title}</h3>
                      <p className="text-sm text-muted">{achievement.description}</p>
                      {achievement.earned && (
                        <Badge className="mt-2 bg-chart-1/10 text-chart-1">{t("myLearning.valuable")}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default MyLearning;
