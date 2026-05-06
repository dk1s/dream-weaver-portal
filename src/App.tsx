import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Profile from "./pages/Profile.tsx";
import MyContests from "./pages/MyContests.tsx";
import Wallet from "./pages/Wallet.tsx";
import CreateTeam from "./pages/CreateTeam.tsx";
import Bet from "./pages/Bet.tsx";
import LiveScore from "./pages/LiveScore.tsx";
import ContestSelect from "./pages/ContestSelect.tsx";
import ContestsHub from "./pages/ContestsHub.tsx";
import ContestDetail from "./pages/ContestDetail.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-contests" element={<MyContests />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path="/bet" element={<Bet />} />
          <Route path="/live" element={<LiveScore />} />
          <Route path="/contests" element={<ContestSelect />} />
          <Route path="/contests-hub" element={<ContestsHub />} />
          <Route path="/contest/:id" element={<ContestDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
