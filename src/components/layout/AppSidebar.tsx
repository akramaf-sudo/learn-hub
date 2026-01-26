import { useState } from "react";
import {
  Home,
  Video,
  BookOpen,
  FileText,
  GraduationCap,
  Search,
  ChevronLeft,
  Menu,
  LogOut,
  Shield,
  Upload,
  Users,
  Languages
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useLanguage } from "@/contexts/LanguageContext";
import yolafreshLogo from "@/assets/yolafresh-logo.jpg";

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AppSidebar({ isOpen, onToggle }: AppSidebarProps) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { t, language, setLanguage } = useLanguage();

  const menuItems = [
    { title: t("sidebar.dashboard"), url: "/", icon: Home },
    { title: t("sidebar.videos"), url: "/videos", icon: Video },
    { title: t("sidebar.guides"), url: "/guides", icon: BookOpen },
    { title: t("sidebar.procedures"), url: "/procedures", icon: FileText },
    { title: t("sidebar.myLearning"), url: "/my-learning", icon: GraduationCap },
  ];

  const adminMenuItems = [
    { title: t("sidebar.uploadVideo"), url: "/upload-video", icon: Upload },
    { title: t("sidebar.manageVideos"), url: "/admin/videos", icon: Upload },
    { title: t("sidebar.manageEmployees"), url: "/admin/employees", icon: Users },
  ];

  const getUserInitials = () => {
    const email = user?.email || "";
    const name = user?.user_metadata?.full_name || email.split("@")[0];
    return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getUserName = () => {
    return user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Employee";
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300 ease-in-out flex flex-col",
          isOpen ? "w-64" : "w-0 lg:w-16",
          "lg:relative"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b border-sidebar-border",
          !isOpen && "lg:justify-center"
        )}>
          {isOpen ? (
            <>
              <div className="flex items-center gap-2">
                <img
                  src={yolafreshLogo}
                  alt="Yolafresh"
                  className="h-8 object-contain"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="hidden lg:flex text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Search */}
        {isOpen && (
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rtl:left-auto rtl:right-3" />
              <Input
                placeholder={t("sidebar.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rtl:pl-3 rtl:pr-9 bg-accent border-sidebar-border"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems
              .filter(item => {
                if (isAdmin) return true;
                // Employees only see Dashboard, Videos, and My Learning
                return ["Dashboard", "Videos", "My Learning", t("sidebar.dashboard"), t("sidebar.videos"), t("sidebar.myLearning")].includes(item.title);
              })
              .map((item) => (
                <li key={item.title}>
                  <NavLink
                    to={item.url}
                    end={item.url === "/"}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                      !isOpen && "lg:justify-center lg:px-2"
                    )}
                    activeClassName="bg-primary text-primary-foreground hover:bg-primary"
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {isOpen && <span className="font-medium">{item.title}</span>}
                  </NavLink>
                </li>
              ))}
          </ul>

          {/* Admin Section */}
          {isAdmin && (
            <>
              {isOpen && (
                <div className="mt-6 mb-2 px-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <Shield className="w-3 h-3" />
                    {t("sidebar.admin")}
                  </div>
                </div>
              )}
              <ul className="space-y-1">
                {adminMenuItems.map((item) => (
                  <li key={item.title}>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                        !isOpen && "lg:justify-center lg:px-2"
                      )}
                      activeClassName="bg-primary text-primary-foreground hover:bg-primary"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {isOpen && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </>
          )}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 mb-3"
              onClick={toggleLanguage}
            >
              <Languages className="w-4 h-4" />
              {language === "en" ? "العربية" : "English"}
            </Button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">{getUserInitials()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{getUserName()}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={signOut}
            >
              <LogOut className="w-4 h-4" />
              {t("sidebar.signOut")}
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
