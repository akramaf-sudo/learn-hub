import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";

export default function UploadVideo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("General");
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) {
            toast.error("Please provide a title and select a video file");
            return;
        }

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. Upload file to storage
            const { error: uploadError } = await supabase.storage
                .from('videos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('videos')
                .getPublicUrl(filePath);

            // 3. Insert record into database
            const { error: dbError } = await supabase
                .from('training_videos')
                .insert({
                    title,
                    description,
                    category,
                    video_url: publicUrl,
                    // created_by, duration, etc. can be enhanced
                });

            if (dbError) throw dbError;

            toast.success("Video uploaded successfully!");
            navigate("/");
        } catch (error: any) {
            toast.error(error.message || "Error uploading video");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background">
            <AppSidebar />
            <main className="flex-1 p-8">
                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Training Video</CardTitle>
                            <CardDescription>Share knowledge with your team</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpload} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Video Title</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. How to handle customer returns"
                                        disabled={uploading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Briefly describe the content of this video"
                                        disabled={uploading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Input
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        placeholder="e.g. Operations, Tech, HR"
                                        disabled={uploading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="video">Video File</Label>
                                    <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                                        <input
                                            type="file"
                                            id="video"
                                            accept="video/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            disabled={uploading}
                                        />
                                        <label htmlFor="video" className="cursor-pointer flex flex-col items-center">
                                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                                {file ? file.name : "Click to select video"}
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full" disabled={uploading}>
                                    {uploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        "Upload Video"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
