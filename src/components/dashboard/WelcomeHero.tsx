import { Button } from "@/components/ui/button";
import { Play, BookOpen } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import { useAuth } from "@/hooks/useAuth";

export function WelcomeHero() {
  const { user } = useAuth();
  
  const getFirstName = () => {
    const fullName = user?.user_metadata?.full_name;
    if (fullName) {
      return fullName.split(" ")[0];
    }
    const email = user?.email || "";
    return email.split("@")[0].split(".")[0].charAt(0).toUpperCase() + email.split("@")[0].split(".")[0].slice(1);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-card">
      {/* Background image */}
      <div className="absolute inset-0">
        <img 
          src={heroBanner} 
          alt="Training background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 lg:p-16">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 text-sm font-medium bg-primary-foreground/20 text-primary-foreground rounded-full mb-4">
            Welcome back, {getFirstName()}! 👋
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            Master Your Tools, <br />
            <span className="text-primary-foreground/90">Elevate Your Skills</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg">
            Access comprehensive training materials, video tutorials, and step-by-step guides to become proficient in all our internal tools.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" variant="secondary" className="gap-2">
              <Play className="w-4 h-4" />
              Continue Learning
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
              <BookOpen className="w-4 h-4" />
              Browse Catalog
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
