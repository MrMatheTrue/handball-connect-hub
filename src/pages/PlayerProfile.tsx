import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { getPlayers, Player } from "@/data/mockData";
import { maskSensitiveInfo } from "@/utils/contentSecurity";
import { canViewContactData, canViewVideos, canSendMessage } from "@/utils/privacyRules";
import PaywallMessage from "@/components/PaywallMessage";
import ChatInterface from "@/components/chat/ChatInterface";
import {
  MapPin, Calendar, Ruler, Weight, Shield, Crown, Edit,
  MessageSquare, Play, ExternalLink, ChevronLeft, Award, Mail, Phone, Users, Lock
} from "lucide-react";
import { useState } from "react";

const PlayerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, isPremium, userType, isAdmin } = useUser();
  const [showChat, setShowChat] = useState(false);

  const players = getPlayers();
  const player = players.find(p => p.id === id);

  if (!player) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Jogador não encontrado</h1>
            <p className="text-muted-foreground mb-8">O perfil que você está procurando não existe ou foi removido.</p>
            <Link to="/jogadores"><Button variant="hero">Ver Jogadores</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isOwnProfile = currentUser?.profileId === player.id;
  const accessParams = {
    viewerType: userType,
    viewerIsPremium: isPremium,
    viewerIsAdmin: isAdmin,
    isOwnProfile,
    targetType: 'player' as const,
  };
  const hasContactAccess = canViewContactData(accessParams);
  const hasVideoAccess = canViewVideos(accessParams);
  const canMessage = canSendMessage(accessParams);

  const age = player.birthDate
    ? Math.floor((new Date().getTime() - new Date(player.birthDate).getTime()) / 31557600000)
    : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponível": return "bg-green-500/20 text-green-400";
      case "Em negociação": return "bg-yellow-500/20 text-yellow-400";
      case "Contrato atual": return "bg-blue-500/20 text-blue-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const getBlockMessage = () => {
    if (userType === 'player') {
      return "Atletas não podem ver dados de contato ou enviar mensagens para outros atletas.";
    }
    return "Dados de contato disponíveis apenas para assinantes Premium.";
  };

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
              {/* Header Card */}
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-primary/30 to-orange-light/20">
                  {player.isPremiumProfile && (
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full premium-badge text-sm font-semibold">
                        <Crown className="w-4 h-4" /> PRO
                      </div>
                    </div>
                  )}
                  <div className="absolute -bottom-16 left-8">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/40 to-orange-light/30 flex items-center justify-center border-4 border-card overflow-hidden">
                      {player.photoUrl ? (
                        <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-display text-4xl text-primary">
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-20 pb-6 px-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{player.name}</h1>
                      <p className="text-primary text-lg font-medium">{player.position}</p>
                      <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium mt-2 ${getStatusColor(player.status)}`}>
                        {player.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {isOwnProfile || isAdmin ? (
                        <Link to={`/editar-jogador/${player.id}`}>
                          <Button variant="glass" className="gap-2">
                            <Edit className="w-4 h-4" />
                            {isAdmin && !isOwnProfile ? "Modo Admin (Editar)" : "Editar Perfil"}
                          </Button>
                        </Link>
                      ) : canMessage ? (
                        <Button variant="hero" className="gap-2" onClick={() => setShowChat(true)}>
                          <MessageSquare className="w-4 h-4" /> Enviar Mensagem
                        </Button>
                      ) : userType === 'player' ? (
                        <div className="bg-secondary/50 px-4 py-2 rounded-lg border border-border">
                          <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Atletas não podem enviar mensagens para outros atletas
                          </p>
                        </div>
                      ) : (
                        <PaywallMessage type="message" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Sobre</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {maskSensitiveInfo(player.description || "Nenhuma descrição disponível.", hasContactAccess)}
                </p>
              </div>

              {/* Club History */}
              {player.clubHistory.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" /> Histórico de Clubes
                  </h2>
                  <div className="space-y-4">
                    {player.clubHistory.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.club}</p>
                          <p className="text-sm text-muted-foreground">{item.period}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {player.videoLinks.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-primary" /> Vídeos
                  </h2>
                  {hasVideoAccess ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {player.videoLinks.map((link, index) => {
                        const youtubeId = getYouTubeId(link);
                        return youtubeId ? (
                          <div key={index} className="aspect-video rounded-xl overflow-hidden">
                            <iframe src={`https://www.youtube.com/embed/${youtubeId}`} title={`Vídeo ${index + 1}`} className="w-full h-full" allowFullScreen />
                          </div>
                        ) : (
                          <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                            <ExternalLink className="w-5 h-5 text-primary" />
                            <span className="text-sm truncate">{link}</span>
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    <PaywallMessage type="video" />
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Informações</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">{player.city}, {player.state}, {player.nationality}</span>
                  </div>
                  {age && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">{age} anos</span>
                    </div>
                  )}
                  {player.height > 0 && (
                    <div className="flex items-center gap-3 text-sm">
                      <Ruler className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">{player.height} cm</span>
                    </div>
                  )}
                  {player.weight > 0 && (
                    <div className="flex items-center gap-3 text-sm">
                      <Weight className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">{player.weight} kg</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">{player.level}</span>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Características</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-secondary/50">
                    <p className="text-2xl font-bold text-primary">{player.height || '-'}</p>
                    <p className="text-xs text-muted-foreground">Altura (cm)</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-secondary/50">
                    <p className="text-2xl font-bold text-primary">{player.weight || '-'}</p>
                    <p className="text-xs text-muted-foreground">Peso (kg)</p>
                  </div>
                  <div className="col-span-2 text-center p-4 rounded-xl bg-secondary/50">
                    <p className="text-lg font-bold text-primary">{player.dominantHand}</p>
                    <p className="text-xs text-muted-foreground">Mão Dominante</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="glass-card rounded-2xl p-6 border-accent-glow">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" /> Contato Direto
                </h2>
                {hasContactAccess ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-secondary/30">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-foreground">{player.email}</span>
                    </div>
                    {player.phone && (
                      <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-secondary/30">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-foreground">{player.phone}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="text-xs text-muted-foreground mb-4">{getBlockMessage()}</p>
                    {userType !== 'player' && (
                      <Link to="/premium" className="block">
                        <Button variant="hero" size="sm" className="w-full">Liberar Acesso</Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {showChat && (
        <ChatInterface recipientId={player.id} recipientName={player.name} recipientType="player" onClose={() => setShowChat(false)} />
      )}
    </div>
  );
};

export default PlayerProfile;
