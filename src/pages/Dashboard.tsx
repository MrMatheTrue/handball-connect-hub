import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import PlayerSearchWidget from "@/components/dashboard/PlayerSearchWidget";
import { getPlayers, getClubs, getAgents, getOpportunities, getMessages, getConversations } from "@/data/mockData";
import { User, Building2, Users, Briefcase, MessageSquare, Settings, Crown, Edit, Eye, FileText, GraduationCap, Plus, ArrowRight, Clock, Star } from "lucide-react";

const Dashboard = () => {
  const { currentUser, isPremium, userType } = useUser();

  // Get real data for stats
  const allMessages = getMessages();
  const allConversations = getConversations();
  const allOpportunities = getOpportunities();

  // Filter messages for current user
  const userMessages = currentUser
    ? allMessages.filter(m => m.senderId === currentUser.id || m.receiverId === currentUser.id)
    : [];
  const unreadMessages = currentUser
    ? allMessages.filter(m => m.receiverId === currentUser.id && !m.read).length
    : 0;

  // Get user-specific opportunities
  const userOpportunities = currentUser && (userType === 'club' || userType === 'agent')
    ? allOpportunities.filter(o => o.clubId === currentUser.profileId || o.agentId === currentUser.profileId)
    : [];

  // Get applied opportunities for players/coaches
  const appliedOpportunities = currentUser && (userType === 'player' || userType === 'coach')
    ? allOpportunities.filter(o => o.applicantIds?.includes(currentUser.profileId || ''))
    : [];

  // Recent opportunities for recommendations
  const recentOpportunities = allOpportunities.slice(0, 3);

  const getMenuItems = () => {
    const baseItems = [
      { icon: MessageSquare, label: "Mensagens", href: "/mensagens", description: "Suas conversas", premium: true, count: unreadMessages },
      { icon: Settings, label: "Configurações", href: "/configuracoes", description: "Configurações da conta" },
    ];

    if (userType === 'player') {
      return [
        { icon: User, label: "Meu Perfil", href: currentUser?.profileId ? `/jogador/${currentUser.profileId}` : "/criar-jogador", description: currentUser?.profileId ? "Visualizar e editar seu perfil" : "Criar seu perfil" },
        { icon: Briefcase, label: "Minhas Candidaturas", href: "/candidaturas", description: `${appliedOpportunities.length} vagas aplicadas` },
        ...baseItems,
      ];
    }

    if (userType === 'coach') {
      return [
        { icon: GraduationCap, label: "Meu Perfil", href: `/tecnico/${currentUser?.id}`, description: "Visualizar e editar seu perfil" },
        { icon: Briefcase, label: "Minhas Candidaturas", href: "/candidaturas", description: `${appliedOpportunities.length} vagas aplicadas` },
        ...baseItems,
      ];
    }

    if (userType === 'club') {
      return [
        { icon: Building2, label: "Meu Perfil", href: currentUser?.profileId ? `/clube/${currentUser.profileId}` : "/criar-clube", description: currentUser?.profileId ? "Visualizar e editar seu perfil" : "Criar perfil do clube" },
        { icon: FileText, label: "Minhas Vagas", href: "/minhas-vagas", description: `${userOpportunities.length} vagas publicadas`, premium: true },
        { icon: Eye, label: "Candidaturas Recebidas", href: "/candidaturas-recebidas", description: "Ver quem se candidatou" },
        ...baseItems,
      ];
    }

    if (userType === 'agent') {
      return [
        { icon: Users, label: "Meu Perfil", href: currentUser?.profileId ? `/agente/${currentUser.profileId}` : "/criar-agente", description: currentUser?.profileId ? "Visualizar e editar seu perfil" : "Criar seu perfil" },
        { icon: FileText, label: "Minhas Vagas", href: "/minhas-vagas", description: `${userOpportunities.length} vagas publicadas`, premium: true },
        { icon: Eye, label: "Candidaturas Recebidas", href: "/candidaturas-recebidas", description: "Ver quem se candidatou" },
        ...baseItems,
      ];
    }

    return [
      { icon: User, label: "Meu Perfil", href: "/meu-perfil", description: "Visualizar e editar seu perfil" },
      ...baseItems,
    ];
  };

  const getQuickActions = () => {
    if (userType === 'player') {
      return [
        { icon: Edit, label: "Editar Perfil", href: `/jogador/${currentUser?.id}` },
        { icon: Briefcase, label: "Ver Vagas", href: "/oportunidades" },
        ...(!isPremium ? [{ icon: Star, label: "Seja Premium Atleta", href: "/premium" }] : []),
      ];
    }

    if (userType === 'coach') {
      return [
        { icon: Edit, label: "Editar Perfil", href: `/tecnico/${currentUser?.id}` },
        { icon: Briefcase, label: "Ver Vagas", href: "/oportunidades" },
        ...(!isPremium ? [{ icon: Star, label: "Seja Premium", href: "/premium" }] : []),
      ];
    }

    if (userType === 'club') {
      return [
        { icon: Plus, label: "Publicar Vaga", href: isPremium ? "/publicar-vaga" : "/premium", premium: !isPremium },
        { icon: Users, label: "Buscar Jogadores", href: "/jogadores" },
        ...(!isPremium ? [{ icon: Star, label: "Seja Premium Profissional", href: "/premium" }] : []),
      ];
    }

    if (userType === 'agent') {
      return [
        { icon: Plus, label: "Publicar Vaga", href: isPremium ? "/publicar-vaga" : "/premium", premium: !isPremium },
        { icon: Users, label: "Buscar Jogadores", href: "/jogadores" },
        { icon: Building2, label: "Buscar Clubes", href: "/clubes" },
        ...(!isPremium ? [{ icon: Star, label: "Seja Premium Profissional", href: "/premium" }] : []),
      ];
    }

    return [];
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'player': return 'Jogador';
      case 'coach': return 'Técnico';
      case 'club': return 'Clube';
      case 'agent': return 'Agente';
      default: return 'Usuário';
    }
  };

  const getUserTypeIcon = () => {
    switch (userType) {
      case 'player': return User;
      case 'coach': return GraduationCap;
      case 'club': return Building2;
      case 'agent': return Users;
      default: return User;
    }
  };

  const UserIcon = getUserTypeIcon();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <div className="glass-card rounded-2xl p-8 mb-8 border-accent-glow">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-orange-light flex items-center justify-center shadow-lg">
                  <UserIcon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Olá, {currentUser?.name || 'Usuário'}!
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-muted-foreground">{getUserTypeLabel()}</span>
                    {isPremium && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full premium-badge text-xs font-semibold">
                        <Crown className="w-3 h-3" />
                        Premium
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {!isPremium && (
                <Link to="/premium">
                  <Button variant="hero" className="gap-2">
                    <Crown className="w-4 h-4" />
                    Seja Premium
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass-card rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-primary">127</p>
              <p className="text-sm text-muted-foreground">Visualizações do Perfil</p>
            </div>
            <div className="glass-card rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-primary">{userMessages.length}</p>
              <p className="text-sm text-muted-foreground">Mensagens</p>
              {unreadMessages > 0 && (
                <span className="text-xs text-primary">{unreadMessages} não lidas</span>
              )}
            </div>
            <div className="glass-card rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-primary">
                {userType === 'player' || userType === 'coach' ? appliedOpportunities.length : userOpportunities.length}
              </p>
              <p className="text-sm text-muted-foreground">
                {userType === 'player' || userType === 'coach' ? 'Candidaturas' : 'Vagas Publicadas'}
              </p>
            </div>
            <div className="glass-card rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-primary">42</p>
              <p className="text-sm text-muted-foreground">Conexões</p>
            </div>
          </div>

          {/* Widget IA — apenas para clube, agente e técnico */}
          {(userType === 'club' || userType === 'agent' || userType === 'coach') && (
            <PlayerSearchWidget />
          )}

          {/* Quick Actions */}
          {getQuickActions().length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
              <div className="flex flex-wrap gap-3">
                {getQuickActions().map((action, index) => {
                  const isPremiumAction = 'premium' in action && action.premium;
                  return (
                    <Link key={index} to={action.href}>
                      <Button
                        variant={isPremiumAction && !isPremium ? "outline" : "default"}
                        className="gap-2"
                        disabled={isPremiumAction && !isPremium}
                      >
                        <action.icon className="w-4 h-4" />
                        {action.label}
                        {isPremiumAction && !isPremium && <Crown className="w-3 h-3 text-primary" />}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Menu Grid */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Menu</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {getMenuItems().map((item, index) => (
                <Link key={index} to={'premium' in item && item.premium && !isPremium ? "/premium" : item.href} className="block">
                  <div className="glass-card rounded-2xl p-6 card-hover h-full">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 relative">
                        <item.icon className="w-6 h-6 text-primary" />
                        {'count' in item && item.count && item.count > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {item.count}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{item.label}</h3>
                          {item.premium && !isPremium && (
                            <Crown className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recommended Opportunities for Players/Coaches */}
          {(userType === 'player' || userType === 'coach') && recentOpportunities.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Oportunidades Recomendadas</h2>
                <Link to="/oportunidades" className="text-primary text-sm flex items-center gap-1 hover:underline">
                  Ver todas <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentOpportunities.map((opp) => (
                  <Link key={opp.id} to={`/oportunidade/${opp.id}`} className="glass-card rounded-xl p-4 card-hover block">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">{opp.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{opp.position}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {opp.location}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Premium CTA */}
          {!isPremium && (
            <div className="mt-12 glass-card rounded-2xl p-8 border-accent-glow text-center">
              <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Desbloqueie todo o potencial</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Com o Premium você pode enviar mensagens, candidatar-se a vagas e ter seu perfil em destaque.
              </p>
              <Link to="/premium">
                <Button variant="hero" size="lg">
                  Ver Planos Premium
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
