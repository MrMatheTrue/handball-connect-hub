import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { getCoaches, Coach } from "@/data/mockData";
import { maskSensitiveInfo } from "@/utils/contentSecurity";
import { canViewContactData, canViewVideos, canSendMessage } from "@/utils/privacyRules";
import PaywallMessage from "@/components/PaywallMessage";
import ChatInterface from "@/components/chat/ChatInterface";
import {
  MapPin, Calendar, Shield, Crown, Edit,
  MessageSquare, Play, ExternalLink, ChevronLeft, Award, GraduationCap, Mail, Phone, Lock
} from "lucide-react";
import { useState } from "react";

const CoachProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, isPremium, userType, isAdmin } = useUser();
  const [showChat, setShowChat] = useState(false);

  const coaches = getCoaches();
  const coach = coaches.find(c => c.id === id);

  if (!coach) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Técnico não encontrado</h1>
            <p className="text-muted-foreground mb-8">O perfil que você está procurando não existe ou foi removido.</p>
            <Link to="/tecnicos"><Button variant="hero">Ver Técnicos</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isOwnProfile = currentUser?.profileId === coach.id;
  const accessParams = {
    viewerType: userType,
    viewerIsPremium: isPremium,
    viewerIsAdmin: isAdmin,
    isOwnProfile,
    targetType: 'coach' as const,
  };
  const hasContactAccess = canViewContactData(accessParams);
  const hasVideoAccess = canViewVideos(accessParams);
  const canMessage = canSendMessage(accessParams);

  const age = coach.birthDate
    ? Math.floor((new Date().getTime() - new Date(coach.birthDate).getTime()) / 31557600000)
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
                <div className="relative h-48 bg-gradient-to-br from-primary/30 to-orange-light/20">
                  {coach.isPremiumProfile && (
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full premium-badge text-sm font-semibold">
                        <Crown className="w-4 h-4" /> PRO
                      </div>
                    </div>
                  )}
                  <div className="absolute -bottom-16 left-8">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/40 to-orange-light/30 flex items-center justify-center border-4 border-card overflow-hidden">
                      {coach.photoUrl ? (
                        <img src={coach.photoUrl} alt={coach.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-display text-4xl text-primary">{coach.name.split(' ').map(n => n[0]).join('')}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-20 pb-6 px-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{coach.name}</h1>
                      <p className="text-primary text-lg font-medium">{coach.specialization}</p>
                      <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium mt-2 ${getStatusColor(coach.status)}`}>{coach.status}</span>
                    </div>
                    <div className="flex gap-2">
                      {isOwnProfile || isAdmin ? (
                        <Link to={`/editar-tecnico/${coach.id}`}>
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
                <h2 className="text-lg font-semibold mb-4">Sobre</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {maskSensitiveInfo(coach.description || "Nenhuma descrição disponível.", hasContactAccess)}
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" /> Histórico Profissional
                </h2>
                <div className="space-y-4">
                  {coach.clubHistory.length > 0 ? coach.clubHistory.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.club}</p>
                        <p className="text-sm text-primary">{item.role}</p>
                        <p className="text-xs text-muted-foreground">{item.period}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-muted-foreground italic text-center">Nenhum histórico registrado.</p>
                  )}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" /> Certificações
                </h2>
                <div className="flex flex-wrap gap-2">
                  {coach.certifications.length > 0 ? coach.certifications.map((cert, index) => (
                    <span key={index} className="px-3 py-1.5 rounded-lg bg-secondary text-sm font-medium border border-border">{cert}</span>
                  )) : (
                    <p className="text-muted-foreground italic">Nenhuma certificação listada.</p>
                  )}
                </div>
              </div>

              {coach.videoLinks.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-primary" /> Vídeos & Metodologia
                  </h2>
                  {hasVideoAccess ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {coach.videoLinks.map((link, index) => {
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

            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Informações</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">{coach.city}, {coach.state}, {coach.nationality}</span>
                  </div>
                  {age && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">{age} anos</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Award className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">{coach.experience} de experiência</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">{coach.level}</span>
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
                      <span className="text-foreground">{coach.email}</span>
                    </div>
                    {coach.phone && (
                      <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-secondary/30">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-foreground">{coach.phone}</span>
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
        <ChatInterface recipientId={coach.id} recipientName={coach.name} recipientType="coach" onClose={() => setShowChat(false)} />
      )}
    </div>
  );
};

export default CoachProfile;
