import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";

import Index from "./pages/Index";
import Jogadores from "./pages/Jogadores";
import Tecnicos from "./pages/Tecnicos";
import Clubes from "./pages/Clubes";
import Agentes from "./pages/Agentes";
import Oportunidades from "./pages/Oportunidades";
import Noticias from "./pages/Noticias";
import Premium from "./pages/Premium";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RecuperarSenha from "./pages/RecuperarSenha";
import NotFound from "./pages/NotFound";
// Profile detail pages
import PlayerProfile from "./pages/PlayerProfile";
import CoachProfile from "./pages/CoachProfile";
import ClubProfile from "./pages/ClubProfile";
import AgentProfile from "./pages/AgentProfile";
import OpportunityDetail from "./pages/OpportunityDetail";
import ArticleDetail from "./pages/ArticleDetail";
// Profile creation pages
import CreatePlayer from "./pages/CreatePlayer";
import CreateClub from "./pages/CreateClub";
import CreateAgent from "./pages/CreateAgent";
import CreateOpportunity from "./pages/CreateOpportunity";
import ChangePassword from "./pages/ChangePassword";
// Footer pages
import ComoFunciona from "./pages/ComoFunciona";
import FAQ from "./pages/FAQ";
import SobreNos from "./pages/SobreNos";
import Contato from "./pages/Contato";
import TermosDeUso from "./pages/TermosDeUso";
import Privacidade from "./pages/Privacidade";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/jogadores" element={<Jogadores />} />
            <Route path="/tecnicos" element={<Tecnicos />} />
            <Route path="/clubes" element={<Clubes />} />
            <Route path="/agentes" element={<Agentes />} />
            <Route path="/oportunidades" element={<Oportunidades />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/recuperar-senha" element={<RecuperarSenha />} />

            {/* Profile Detail Routes */}
            <Route path="/jogador/:id" element={<PlayerProfile />} />
            <Route path="/tecnico/:id" element={<CoachProfile />} />
            <Route path="/clube/:id" element={<ClubProfile />} />
            <Route path="/agente/:id" element={<AgentProfile />} />
            <Route path="/oportunidade/:id" element={<OpportunityDetail />} />
            <Route path="/noticia/:id" element={<ArticleDetail />} />

            {/* Profile Creation Routes */}
            <Route path="/criar-jogador" element={<CreatePlayer />} />
            <Route path="/criar-clube" element={<CreateClub />} />
            <Route path="/criar-agente" element={<CreateAgent />} />
            <Route path="/publicar-vaga" element={<CreateOpportunity />} />
            <Route path="/alterar-senha" element={<ChangePassword />} />

            {/* Footer Pages */}
            <Route path="/como-funciona" element={<ComoFunciona />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/sobre" element={<SobreNos />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/termos" element={<TermosDeUso />} />
            <Route path="/privacidade" element={<Privacidade />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>

        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
