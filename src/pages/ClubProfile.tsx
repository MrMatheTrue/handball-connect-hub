import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { getClubs, getPlayers, Club } from "@/data/mockData";
import { maskSensitiveInfo } from "@/utils/contentSecurity";
import { canViewContactData, canSendMessage } from "@/utils/privacyRules";
import PaywallMessage from "@/components/PaywallMessage";
import ChatInterface from "@/components/chat/ChatInterface";
import {
  MapPin, Trophy, Users, Building2, Calendar, Edit,
  MessageSquare, Image, ChevronLeft, Crown, Mail, Phone, Lock
} from "lucide-react";
import { useState } from "react";

const ClubProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, isPremium, userType, isAdmin } = useUser();
  const [showChat, setShowChat] = useState(false);

  const clubs = getClubs();
  const club = clubs.find(c => c.id === id);

  if (!club) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Clube não encontrado</h1>
            <p className="text-muted-foreground mb-8">O perfil que você está procurando não existe ou foi removido.</p>
            <Link to="/clubes"><Button variant="hero">Ver Clubes</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isOwnProfile = currentUser?.profileId === club.id;
  const accessParams = {
    viewerType: userType,
    viewerIsPremium: isPremium,
    viewerIsAdmin: isAdmin,
    isOwnProfile,
    targetType: 'club' as const,
  };
  const hasContactAccess = canViewContactData(accessParams);
  const canMessage = canSendMessage(accessParams);

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
                  <div className="absolute -bottom-16 left-8">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/40 to-orange-light/30 flex items-center justify-center border-4 border-card overflow-hidden">
                      {club.logoUrl ? (
                        <img src={club.logoUrl} alt={club.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-display text-3xl text-primary">{club.name.substring(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-20 pb-6 px-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{club.name}</h1>
                      <div className="flex items-center gap-2 mt-2">
                        <Trophy className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{club.league}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isOwnProfile || isAdmin ? (
                        <Link to={`/editar-clube/${club.id}`}>
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
                <h2 className="text-lg font-semibold mb-4">Sobre o Clube</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {maskSensitiveInfo(club.description || "Nenhuma descrição disponível.", hasContactAccess)}
                </p>
              </div>

              {club.history && (
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-semibold mb-4 text-primary">Nossa História</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{club.history}</p>
                </div>
              )}

              {club.photos && club.photos.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Image className="w-5 h-5 text-primary" /> Galeria de Fotos
                  </h2>
                  {hasContactAccess || isOwnProfile ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {club.photos.map((photo, index) => (
                        <div key={index} className="aspect-video rounded-xl overflow-hidden">
                          <img src={photo} alt={`Foto ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <PaywallMessage type="custom" title="Galeria" message="Veja mais fotos das instalações e jogos assinando o Premium." />
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
                    <span className="text-muted-foreground">{club.city}, {club.state}, {club.country}</span>
                  </div>
                  {club.founded && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">Fundado em {club.founded}</span>
                    </div>
                  )}
                  {club.gymnasium && (
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">{club.gymnasium}</span>
                    </div>
                  )}
                  {club.playersCount && (
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">{club.playersCount} atletas</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Estatísticas</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-secondary/50">
                    <p className="text-2xl font-bold text-primary">{club.playersCount || '-'}</p>
                    <p className="text-xs text-muted-foreground">Atletas</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-secondary/50">
                    <p className="text-2xl font-bold text-primary">{club.founded || '-'}</p>
                    <p className="text-xs text-muted-foreground">Fundação</p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 border-accent-glow">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" /> Contato Oficial
                </h2>
                {hasContactAccess ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-secondary/30">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-foreground">{club.email}</span>
                    </div>
                    {club.phone && (
                      <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-secondary/30">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-foreground">{club.phone}</span>
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
        <ChatInterface recipientId={club.id} recipientName={club.name} recipientType="club" onClose={() => setShowChat(false)} />
      )}
    </div>
  );
};

export default ClubProfile;
