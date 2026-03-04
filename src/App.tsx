import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Lazy-loaded pages for code splitting
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const TripsPage = lazy(() => import("./pages/dashboard/TripsPage"));
const TripDetailPage = lazy(() => import("./pages/dashboard/TripDetailPage"));
const ChatPage = lazy(() => import("./pages/dashboard/ChatPage"));
const CommunityPage = lazy(() => import("./pages/dashboard/CommunityPage"));
const SettingsPage = lazy(() => import("./pages/dashboard/SettingsPage"));
const SharePage = lazy(() => import("./pages/SharePage"));
const ProfilePage = lazy(() => import("./pages/dashboard/ProfilePage"));
const FavoritesPage = lazy(() => import("./pages/dashboard/FavoritesPage"));
const ExplorePage = lazy(() => import("./pages/dashboard/ExplorePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/share/:slug" element={<SharePage />} />

            {/* Dashboard routes (protected) */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/trips" element={<ProtectedRoute><TripsPage /></ProtectedRoute>} />
            <Route path="/trips/:tripId" element={<ProtectedRoute><TripDetailPage /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

