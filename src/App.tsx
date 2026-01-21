import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import Index from "./pages/Index";
import Videos from "./pages/Videos";
import Guides from "./pages/Guides";
import Procedures from "./pages/Procedures";
import MyLearning from "./pages/MyLearning";
import Login from "./pages/Login";
import AdminVideos from "./pages/AdminVideos";
import AdminEmployees from "./pages/AdminEmployees";
import UploadVideo from "./pages/UploadVideo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/videos" element={<ProtectedRoute><Videos /></ProtectedRoute>} />
            <Route path="/guides" element={<ProtectedRoute><Guides /></ProtectedRoute>} />
            <Route path="/procedures" element={<ProtectedRoute><Procedures /></ProtectedRoute>} />
            <Route path="/my-learning" element={<ProtectedRoute><MyLearning /></ProtectedRoute>} />
            <Route path="/admin/videos" element={<ProtectedRoute><AdminRoute><AdminVideos /></AdminRoute></ProtectedRoute>} />
            <Route path="/admin/employees" element={<ProtectedRoute><AdminRoute><AdminEmployees /></AdminRoute></ProtectedRoute>} />
            <Route path="/upload-video" element={<ProtectedRoute><UploadVideo /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
