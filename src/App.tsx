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
import PhoneAuth from "./pages/PhoneAuth";
import AdminVideos from "./pages/AdminVideos";
import AdminEmployees from "./pages/AdminEmployees";
import UploadVideo from "./pages/UploadVideo";
import UpdatePassword from "./pages/UpdatePassword";
import NotFound from "./pages/NotFound";

import { LanguageProvider } from "@/contexts/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<PhoneAuth />} />
              <Route path="/login-old" element={<Login />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/videos" element={<ProtectedRoute><Videos /></ProtectedRoute>} />
              <Route path="/guides" element={<ProtectedRoute><AdminRoute><Guides /></AdminRoute></ProtectedRoute>} />
              <Route path="/procedures" element={<ProtectedRoute><AdminRoute><Procedures /></AdminRoute></ProtectedRoute>} />
              <Route path="/my-learning" element={<ProtectedRoute><MyLearning /></ProtectedRoute>} />
              <Route path="/admin/videos" element={<ProtectedRoute><AdminRoute><AdminVideos /></AdminRoute></ProtectedRoute>} />
              <Route path="/admin/employees" element={<ProtectedRoute><AdminRoute><AdminEmployees /></AdminRoute></ProtectedRoute>} />
              <Route path="/upload-video" element={<ProtectedRoute><AdminRoute><UploadVideo /></AdminRoute></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
