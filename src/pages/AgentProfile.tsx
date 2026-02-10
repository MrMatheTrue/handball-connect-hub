import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { getAgents, getPlayers, Agent } from "@/data/mockData";
import { maskSensitiveInfo } from "@/utils/contentSecurity";
import { canViewContactData, canSendMessage } from "@/utils/privacyRules";
import PaywallMessage from "@/components/PaywallMessage";
import ChatInterface from "@/components/chat/ChatInterface";
import {
  MapPin, Users, Briefcase, Edit,
  MessageSquare, ChevronLeft, Building, Crown, Mail, Phone, Lock
} from "lucide-react";
import { useState } from "react";

const AgentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, isPremium, userType, isAdmin } = useUser();
  const [showChat, setShowChat] = useState(false);

  const agents = getAgents();
  const players = getPlayers();
  const agent = agents.find(a => a.id === id);

  if (!agent) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Agente não encontrado</h1>
            <p className="text-muted-foreground mb-8">O perfil que você está procurando não existe ou foi removido.</p>
            <Link to="/agentes"><Button variant="hero">Ver Agentes</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isOwnProfile = currentUser?.profileId === agent.id;
  const accessParams = {
    viewerType: userType,
    viewerIsPremium: isPremium,
    viewerIsAdmin: isAdmin,
    isOwnProfile,
    targetType: 'agent' as const,
  };
  const hasContactAccess = canViewContactData(accessParams);
  const canMessage = canSendMessage(accessParams);
  const clientPlayers = players.filter(p => agent.clientIds.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-4 h-4" /> Voltar
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="relative h-40 bg-gradient-to-br from-primary/30 to-orange-light/20">
                  <div className="absolute -bottom-16 left-8">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/40 to-orange-light/30 flex items-center justify-center border-4 border-card overflow-hidden">
                      {agent.photoUrl ? (
                        <img src={agent.photoUrl} alt={agent.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-display text-3xl text-primary">{agent.name.split(' ').map(n => n[0]).join('')}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-20 pb-6 px-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{agent.name}</h1>
                      {agent.agency && <p className="text-primary text-lg font-medium">{agent.agency}</p>}
                    </div>
                    <div className="flex gap-2">
                      {isOwnProfile || isAdmin ? (
                        <Link to={`/editar-agente/${agent.id}`}>
                          <Button variant="glass" className="gap-2">
                            <Edit className="w-4 h-4" />
                            {isAdmin && !isOwnProfile ? "Modo Admin (Editar)" : "Editar Perfil"}
                          </Button>
                        </Link>
                      ) : canMessage ? (
                        <Button variant="hero" className="gap-2" onClick={() => setShowChat(true)}>
                          <MessageSquare className="w-4 h-4" /> Enviar Mensagem
                        </Button>
                      ) : (
                        <PaywallMessage type="message" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4 text-primary">Sobre o Agente</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {maskSensitiveInfo(agent.description || "Nenhuma descrição disponível.", hasContactAccess)}
                </p>
              </div>

              {clientPlayers.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" /> Atletas Representados
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {clientPlayers.map((player) => (
                      <Link key={player.id} to={`/jogador/${player.id}`} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                          <span className="font-medium text-primary">{player.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{player.name}</p>
                          <p className="text-sm text-muted-foreground">{player.position}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Informações</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">{agent.country}</span>
                  </div>
                  {agent.agency && (
                    <div className="flex items-center gap-3 text-sm">
                      <Building className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">{agent.agency}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Estatísticas</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-secondary/50">
                    <p className="text-2xl font-bold text-primary">{agent.clientIds.length}</p>
                    <p className="text-xs text-muted-foreground">Atletas</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-secondary/50">
                    <p className="text-2xl font-bold text-primary">-</p>
                    <p className="text-xs text-muted-foreground">Vagas</p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 border-accent-glow">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" /> Contato Direto
                </h2>
                {hasContactAccess ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-secondary/30">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-foreground">{agent.email}</span>
                    </div>
                    {agent.phone && (
                      <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-secondary/30">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-foreground">{agent.phone}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="text-xs text-muted-foreground mb-4">Dados de contato disponíveis apenas para assinantes Premium.</p>
                    <Link to="/premium" className="block">
                      <Button variant="hero" size="sm" className="w-full">Liberar Acesso</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {showChat && (
        <ChatInterface recipientId={agent.id} recipientName={agent.name} recipientType="agent" onClose={() => setShowChat(false)} />
      )}
    </div>
  );
};

export default AgentProfile;
