import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { getOpportunities, saveOpportunities, getClubs, Opportunity } from "@/data/mockData";
import { maskSensitiveInfo } from "@/utils/contentSecurity";
import { useToast } from "@/hooks/use-toast";
import PaywallMessage from "@/components/PaywallMessage";
import {
  MapPin, Clock, Calendar, Briefcase, Building2, DollarSign,
  ChevronLeft, CheckCircle, Crown, FileText, User, Lock
} from "lucide-react";

const OpportunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, isPremium, userType, isAdmin } = useUser();

  const opportunities = getOpportunities();
  const clubs = getClubs();
  const opportunity = opportunities.find(o => o.id === id);

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Vaga não encontrada</h1>
            <p className="text-muted-foreground mb-8">
              A vaga que você está procurando não existe ou foi removida.
            </p>
            <Link to="/oportunidades">
              <Button variant="hero">Ver Oportunidades</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const club = clubs.find(c => c.id === opportunity.clubId);
  const hasApplied = opportunity.applicantIds.includes(currentUser?.id || "");
  const canApply = isAdmin ||
    (userType === 'player' && opportunity.type === 'player') ||
    (userType === 'coach' && opportunity.type === 'coach');
  const daysAgo = Math.floor((new Date().getTime() - new Date(opportunity.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  const handleApply = () => {
    if (!currentUser) {
      toast({
        title: "Faça login",
        description: "Você precisa estar logado para se candidatar.",
        variant: "destructive",
      });
      return;
    }

    const updatedOpportunities = opportunities.map(o => {
      if (o.id === opportunity.id) {
        return {
          ...o,
          applicantIds: [...o.applicantIds, currentUser.id],
        };
      }
      return o;
    });

    saveOpportunities(updatedOpportunities);

    toast({
      title: "Candidatura enviada!",
      description: "Sua candidatura foi enviada com sucesso. Boa sorte!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <div className="glass-card rounded-2xl p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-orange-light/20 flex items-center justify-center flex-shrink-0 border border-primary/20">
                    {opportunity.type === 'coach' ? (
                      <User className="w-8 h-8 text-primary" />
                    ) : (
                      <Briefcase className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {opportunity.featured && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                          Destaque
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-secondary text-xs font-medium">
                        {opportunity.type === 'coach' ? 'Comissão Técnica' : 'Jogador'}
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                      {opportunity.title}
                    </h1>
                    {isPremium ? (
                      <Link
                        to={`/clube/${opportunity.clubId}`}
                        className="text-lg text-primary hover:underline"
                      >
                        {opportunity.clubName}
                      </Link>
                    ) : (
                      <span className="text-lg text-muted-foreground flex items-center gap-1">
                        <Lock className="w-4 h-4" />
                        Clube Restrito (Premium)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{daysAgo === 0 ? "Hoje" : `Há ${daysAgo} dias`}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{opportunity.contractType}</span>
                  </div>
                  {opportunity.salary && (
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <DollarSign className="w-4 h-4" />
                      <span>{opportunity.salary}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Descrição da Vaga
                </h2>
                {isPremium ? (
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {maskSensitiveInfo(opportunity.description, isPremium)}
                  </p>
                ) : (
                  <PaywallMessage
                    type="custom"
                    title="Descrição Bloqueada"
                    message="A descrição completa desta vaga é exclusiva para assinantes Premium. Assine agora para ver todos os detalhes e se candidatar."
                  />
                )}
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4 text-primary">Requisitos</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {maskSensitiveInfo(opportunity.requirements, isPremium)}
                </p>
              </div>

              {/* Club Info */}
              {club && isPremium && (
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Sobre o Clube
                  </h2>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="font-display text-xl text-primary">
                        {club.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{club.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {club.city}, {club.country} • {club.league}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {club.description}
                      </p>
                      <Link to={`/clube/${club.id}`}>
                        <Button variant="link" className="px-0 mt-2 text-primary">
                          Ver perfil do clube
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <div className="glass-card rounded-2xl p-6 border-accent-glow sticky top-24">
                {hasApplied ? (
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-lg mb-2">Candidatura Enviada!</h3>
                    <p className="text-sm text-muted-foreground">
                      Você já se candidatou a esta vaga. Aguarde o contato do clube.
                    </p>
                  </div>
                ) : !canApply ? (
                  <div className="text-center">
                    <Lock className="w-12 h-12 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-lg mb-2">Restrição de Perfil</h3>
                    <p className="text-sm text-muted-foreground">
                      {userType === 'coach'
                        ? "Técnicos só podem se candidatar a vagas de comissão técnica."
                        : userType === 'player'
                          ? "Atletas só podem se candidatar a vagas de jogador."
                          : "Apenas jogadores e técnicos podem se candidatar a vagas."}
                    </p>
                  </div>
                ) : isPremium ? (
                  <>
                    <h3 className="font-semibold text-lg mb-4">Candidate-se Agora</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Envie sua candidatura e mostre seu interesse nesta oportunidade.
                    </p>
                    <Button
                      variant="hero"
                      className="w-full gap-2"
                      onClick={handleApply}
                    >
                      <Briefcase className="w-4 h-4" />
                      Candidatar-se
                    </Button>
                    {isPremium && (
                      <p className="text-xs text-muted-foreground text-center mt-4">
                        {opportunity.applicantIds.length} pessoas já se candidataram
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <Crown className="w-12 h-12 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-lg text-center mb-2">
                      Assine para se Candidatar
                    </h3>
                    <p className="text-sm text-muted-foreground text-center mb-6">
                      Tenha acesso ilimitado às vagas e candidate-se às melhores oportunidades.
                    </p>
                    <Link to="/premium" className="block">
                      <Button variant="hero" className="w-full">
                        Ver Planos Premium
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Info Box */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Detalhes</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Posição</span>
                    <span className="font-medium">{opportunity.position}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contrato</span>
                    <span className="font-medium">{opportunity.contractType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expira em</span>
                    <span className="font-medium">
                      {new Date(opportunity.expirationDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Candidaturas</span>
                    <span className="font-medium">{isPremium ? opportunity.applicantIds.length : "-"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OpportunityDetail;
