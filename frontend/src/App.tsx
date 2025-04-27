import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import JobListing from "./pages/JobListing";
import JobDetails from "./pages/JobDetails";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import PostJob from "./pages/PostJob";
import Contracts from "./pages/Contracts";
import Payments from "./pages/Payments";
import ProjectDetails from "./pages/ProjectDetails";
import WorkVerification from "./pages/WorkVerification";
import ScreenRecording from "./pages/ScreenRecording";
import Proposals from "./pages/Proposals";
import Notifications from "./pages/Notifications";
import HelpCenter from "./pages/HelpCenter";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Security from "./pages/Security";
import CodeOfConduct from "./pages/CodeOfConduct";
import Contact from "./pages/Contact";
import Enterprise from "./pages/Enterprise";
import Portfolio from "./pages/Portfolio";
import SuccessStories from "./pages/SuccessStories";
import MobileApp from "./pages/MobileApp";
import GrokChatButton from "./components/GrokChatButton";
import { RoleToggle } from "./components/RoleToggle";
import { DashboardSidebar } from "./components/layout/DashboardSidebar";
import FloatingNavbar from "./components/layout/FloatingNavbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
//Upload Test
const queryClient = new QueryClient();

// MainLayout wraps all app pages with Navbar and Sidebar

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Router>
          <FloatingNavbar />
          <Routes>
            {/* Public Marketing Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/enterprise" element={<Enterprise />} />
            <Route path="/jobs" element={<JobListing />} />
            
            {/* Auth Pages */}
            <Route path="/auth">
              <Route path="login" element={<AuthPage type="login" />} />
              <Route path="signup" element={<AuthPage type="signup" />} />
              <Route path="freelancer-signup" element={<AuthPage type="freelancer-signup" />} />
              <Route path="client-signup" element={<AuthPage type="client-signup" />} />
            </Route>
            
            {/* Legal & Info Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/security" element={<Security />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/code-of-conduct" element={<CodeOfConduct />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/mobile-app" element={<MobileApp />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              {/* Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Job Management */}
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/proposals" element={<Proposals />} />
              
              {/* Projects & Contracts */}
              <Route path="/contracts" element={<Contracts />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/work-verification/:id" element={<WorkVerification />} />
              
              {/* User Profile & Settings */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/portfolio" element={<Portfolio />} />
              
              {/* Communication */}
              <Route path="/messages" element={<Messages />} />
              <Route path="/notifications" element={<Notifications />} />
              
              {/* Tools */}
              <Route path="/screen-recording" element={<ScreenRecording />} />
              
              {/* Finance */}
              <Route path="/payments" element={<Payments />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <GrokChatButton />
          <RoleToggle />
        </Router>
        <Toaster />
        <SonnerToaster />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
