import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Target, Clock, Award, Play, BookOpen, FileText, CheckCircle2 } from "lucide-react";

interface LearningItem {
  id: string;
  title: string;
  type: "video" | "guide" | "procedure";
  progress: number;
  totalDuration: string;
  completedAt?: string;
}

const inProgressItems: LearningItem[] = [
  { id: "1", title: "Complete CRM Mastery Course", type: "video", progress: 65, totalDuration: "2h 30min" },
  { id: "2", title: "Data Analysis Best Practices", type: "guide", progress: 40, totalDuration: "20 min read" },
  { id: "3", title: "Customer Onboarding Process", type: "procedure", progress: 80, totalDuration: "5 steps" },
];

const completedItems: LearningItem[] = [
  { id: "4", title: "Getting Started with CRM", type: "video", progress: 100, totalDuration: "12 min", completedAt: "Jan 15, 2026" },
  { id: "5", title: "Email Integration Setup", type: "video", progress: 100, totalDuration: "8 min", completedAt: "Jan 12, 2026" },
  { id: "6", title: "Communication Tools Overview", type: "guide", progress: 100, totalDuration: "8 min read", completedAt: "Jan 10, 2026" },
  { id: "7", title: "Employee Leave Request", type: "procedure", progress: 100, totalDuration: "4 steps", completedAt: "Jan 8, 2026" },
];

const typeConfig = {
  video: { icon: Play, color: "bg-primary/10 text-primary" },
  guide: { icon: BookOpen, color: "bg-chart-1/10 text-chart-1" },
  procedure: { icon: FileText, color: "bg-secondary/10 text-secondary" },
};

const achievements = [
  { title: "First Course", description: "Complete your first training", icon: Trophy, earned: true },
  { title: "Quick Learner", description: "Complete 5 trainings in a week", icon: Target, earned: true },
  { title: "Dedicated", description: "Maintain a 7-day streak", icon: Clock, earned: false },
  { title: "Expert", description: "Complete all CRM trainings", icon: Award, earned: false },
];

const MyLearning = () => {
  return (
    <MainLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Learning</h1>
          <p className="text-muted">Track your progress and achievements</p>
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
                  <p className="text-xs text-muted">Completed</p>
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
                  <p className="text-xs text-muted">In Progress</p>
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
                  <p className="text-2xl font-bold text-card-foreground">24h</p>
                  <p className="text-xs text-muted">Time Spent</p>
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
                  <p className="text-2xl font-bold text-card-foreground">2</p>
                  <p className="text-xs text-muted">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="in-progress" className="space-y-4">
          <TabsList className="bg-accent">
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="in-progress" className="space-y-4">
            {inProgressItems.map((item) => {
              const config = typeConfig[item.type];
              const Icon = config.icon;

              return (
                <Card key={item.id} className="group cursor-pointer hover:shadow-md transition-all border-border bg-card">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted">{item.totalDuration}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <Progress value={item.progress} className="h-2 flex-1" />
                        <span className="text-sm font-medium text-card-foreground">{item.progress}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedItems.map((item) => {
              const config = typeConfig[item.type];
              const Icon = config.icon;

              return (
                <Card key={item.id} className="group cursor-pointer hover:shadow-md transition-all border-border bg-card">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted">{item.totalDuration}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-chart-1" />
                      <span className="text-sm text-muted hidden sm:block">{item.completedAt}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.title}
                  className={`border-border ${achievement.earned ? "bg-card" : "bg-accent/50 opacity-60"}`}
                >
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      achievement.earned ? "bg-chart-1/20" : "bg-muted/20"
                    }`}>
                      <achievement.icon className={`w-7 h-7 ${achievement.earned ? "text-chart-1" : "text-muted"}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">{achievement.title}</h3>
                      <p className="text-sm text-muted">{achievement.description}</p>
                      {achievement.earned && (
                        <Badge className="mt-2 bg-chart-1/10 text-chart-1">Earned</Badge>
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
