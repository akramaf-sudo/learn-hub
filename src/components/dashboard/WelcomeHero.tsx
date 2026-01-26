import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Edit, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

export function WelcomeHero() {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(heroBanner);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("url");
  const [urlInput, setUrlInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings' as any)
        .select('value')
        .eq('key', 'hero_banner')
        .maybeSingle();

      if (!error && data && (data as any).value) {
        setCurrentBanner((data as any).value);
      }
    } catch (error) {
      console.error("Error fetching banner:", error);
    }
  };

  const getFirstName = () => {
    const fullName = user?.user_metadata?.full_name;
    if (fullName) {
      return fullName.split(" ")[0];
    }
    const email = user?.email || "";
    return email.split("@")[0].split(".")[0].charAt(0).toUpperCase() + email.split("@")[0].split(".")[0].slice(1);
  };

  const handleSave = async () => {
    setSaving(true);
    let finalUrl = urlInput;

    try {
      if (activeTab === "upload" && file) {
        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `banner-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('training-videos') // Using existing bucket for now
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('training-videos')
          .getPublicUrl(filePath);

        finalUrl = publicUrl;
        setUploading(false);
      } else if (activeTab === "url" && !urlInput) {
        toast.error("Please enter a URL");
        setSaving(false);
        return;
      }

      // Update settings
      const { error: dbError } = await supabase
        .from('site_settings' as any)
        .upsert({
          key: 'hero_banner',
          value: finalUrl
        });

      if (dbError) throw dbError;

      setCurrentBanner(finalUrl);
      setIsDialogOpen(false);
      toast.success("Banner updated successfully!");
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("Failed to update banner");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-card group">
      {/* Background image */}
      <div className="absolute inset-0 transition-opacity duration-500">
        <img
          src={currentBanner}
          alt="Training background"
          className="w-full h-full object-cover opacity-30"
          onError={(e) => {
            (e.target as HTMLImageElement).src = heroBanner;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
      </div>

      {/* Admin Edit Button */}
      {isAdmin && (
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="sm"
            className="gap-2 shadow-lg"
            onClick={() => setIsDialogOpen(true)}
          >
            <Edit className="w-4 h-4" />
            {t("hero.editCover")}
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 lg:p-16">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 text-sm font-medium bg-primary-foreground/20 text-primary-foreground rounded-full mb-4">
            {t("hero.welcome")}, {getFirstName()}! 👋
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            {t("hero.title")} <br />
            <span className="text-primary-foreground/90">{t("hero.subtitle")}</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg">
            {t("hero.description")}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2"
              onClick={() => navigate("/my-learning")}
            >
              <Play className="w-4 h-4" />
              {t("hero.continue")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => navigate("/videos")}
            >
              <BookOpen className="w-4 h-4" />
              {t("hero.browse")}
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Cover Image</DialogTitle>
            <DialogDescription>
              Choose a new background image for the welcome banner.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="url" onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">Image URL</TabsTrigger>
              <TabsTrigger value="upload">Upload File</TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="url">Image URL</Label>
                <Input
                  id="url"
                  placeholder="https://example.com/image.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Upload Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  {file ? (
                    <div className="text-center">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium">{file.name}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to select image</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || (activeTab === "upload" && !file)}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
