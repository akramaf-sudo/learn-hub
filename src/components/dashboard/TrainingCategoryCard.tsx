import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TrainingCategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "primary" | "secondary" | "accent";
  onClick?: () => void;
}

export function TrainingCategoryCard({ 
  title, 
  description, 
  icon: Icon, 
  color,
  onClick 
}: TrainingCategoryCardProps) {
  const colorStyles = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-chart-1/10 text-chart-1",
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
          colorStyles[color]
        )}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-card-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted mb-3">{description}</p>
      </CardContent>
    </Card>
  );
}
