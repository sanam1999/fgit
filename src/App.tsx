import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Leaves from "./pages/Leaves";
import Departments from "./pages/Departments";
import Payroll from "./pages/Payroll";
import Documents from "./pages/Documents";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login"
import TeamTrack from "./pages/TeamTrack"
import AllWorkFlow from "./pages/AllWorkFlow";
import PrivacyPolicy from "./pages/PrivacyPolicy"
import ProjectManage from "./pages/ProjectManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/leaves" element={<Leaves />} />
          <Route path="/login" element={<Login />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/teamTrack" element={<TeamTrack />} />
          <Route path="/workflow/:id" element={<AllWorkFlow />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/projectmanage" element={<ProjectManage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
