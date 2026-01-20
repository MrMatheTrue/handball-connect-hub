import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap, MessageSquare, Briefcase, Shield, Crown, User, Building2, Users, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "react-i18next";

const Premium = () => {
  const { t } = useTranslation();
  const { isPremium, userType, togglePremium } = useUser();

  const plans = [
    {
      name: t("premium.plans.free"),
      price: "R$ 0",
      period: t("premium.plans.forever"),
      description: t("premium.plans.freeDesc", "Perfeito para começar sua jornada no handebol"),
      features: [
        t("premium.features.createProfile", "Criar perfil completo"),
        t("premium.features.browseProfiles", "Navegação de todos os perfis"),
        t("premium.features.basicSearch", "Busca básica de jogadores e clubes"),
        t("premium.features.accessNews", "Acesso às notícias"),
        t("premium.features.viewOppsList", "Ver lista de oportunidades"),
      ],
      limitations: [
        t("premium.limitations.noChat", "Sem acesso ao chat"),
        t("premium.limitations.noOppDetails", "Sem detalhes de vagas"),
        t("premium.limitations.noApply", "Sem candidatura a vagas"),
      ],
      cta: t("premium.plans.createFree"),
      href: "/cadastro",
      popular: false,
    },
    {
      name: t("premium.plans.athlete"),
      price: "R$ 10",
      period: t("premium.plans.month"),
      description: t("premium.plans.athleteDesc", "Tudo que você precisa para alavancar sua carreira"),
      icon: User,
      features: [
        t("premium.features.everythingFree", "Tudo do plano Gratuito"),
        t("premium.features.unlimitedChat", "Chat ilimitado com clubes e agentes"),
        t("premium.features.fullOppDetails", "Acesso completo às vagas"),
        t("premium.features.unlimitedApply", "Candidatura ilimitada"),
        t("premium.features.featuredProfile", "Perfil em destaque"),
        t("premium.features.prioritySupport", "Suporte prioritário"),
        t("premium.features.viewStats", "Estatísticas de visualizações"),
      ],
      limitations: [],
      cta: isPremium && (userType === 'player' || userType === 'coach') ? t("premium.plans.current") : t("premium.plans.subscribe"),
      href: "/cadastro?plan=premium-athlete",
      popular: true,
    },
    {
      name: t("premium.plans.pro"),
      price: "R$ 50",
      period: t("premium.plans.month"),
      description: t("premium.plans.proDesc", "Para clubes e agentes que buscam talentos"),
      icon: Building2,
      features: [
        t("premium.features.everythingAthlete", "Tudo do Premium Atleta"),
        t("premium.features.postUnlimitedOpps", "Publicar vagas ilimitadas"),
        t("premium.features.manageApplications", "Gerenciar candidaturas"),
        t("premium.features.advancedSearch", "Busca avançada de talentos"),
        t("premium.features.exportPlayers", "Exportar lista de jogadores"),
        t("premium.features.multiUsers", "Múltiplos usuários"),
        t("premium.features.directContact", "Contato direto com atletas"),
      ],
      limitations: [],
      cta: isPremium && (userType === 'club' || userType === 'agent') ? t("premium.plans.current") : t("premium.plans.subscribe"),
      href: "/cadastro?plan=premium-pro",
      popular: false,
    },
  ];

  const features = [
    {
      icon: MessageSquare,
      title: t("premium.features.chatTitle", "Chat Premium"),
      description: t("premium.features.chatDesc", "Comunique-se diretamente com clubes, jogadores e agentes sem limitações."),
    },
    {
      icon: Briefcase,
      title: t("premium.features.oppsTitle", "Vagas Exclusivas"),
      description: t("premium.features.oppsDesc", "Acesse detalhes completos de todas as oportunidades e candidate-se com um clique."),
    },
    {
      icon: Star,
      title: t("premium.features.featuredTitle", "Perfil em Destaque"),
      description: t("premium.features.featuredDesc", "Seu perfil aparece em primeiro nos resultados de busca e com badge Premium."),
    },
    {
      icon: Shield,
      title: t("premium.features.supportTitle", "Suporte Prioritário"),
      description: t("premium.features.supportDesc", "Atendimento dedicado para resolver suas dúvidas rapidamente."),
    },
  ];

  const handleSubscribe = (planType: string) => {
    if (!isPremium) {
      togglePremium();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Current Status */}
          {isPremium && (
            <div className="mb-8 p-4 rounded-xl bg-primary/10 border border-primary/30 text-center">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Crown className="w-5 h-5" />
                <span className="font-semibold">{t("premium.status")}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {t("premium.statusDesc")}
              </p>
            </div>
          )}

          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30 mb-6">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">{t("premium.badge")}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              {t("premium.title")} <span className="gradient-text">{t("premium.highlight")}</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {t("premium.subtitle")}
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-24">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative glass-card rounded-2xl p-8 ${plan.popular ? "border-2 border-primary glow-orange" : "border border-border"
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full premium-badge text-sm font-semibold">
                      {t("premium.plans.popular")}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    {plan.icon && <plan.icon className="w-5 h-5 text-primary" />}
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                  {plan.limitations.map((limitation, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground line-through">
                      <Check className="w-5 h-5 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
                      {limitation}
                    </li>
                  ))}
                </ul>

                {plan.cta === t("premium.plans.current") ? (
                  <Button variant="glass" className="w-full" size="lg" disabled>
                    <Crown className="w-4 h-4 mr-2" />
                    {plan.cta}
                  </Button>
                ) : (
                  <Button
                    variant={plan.popular ? "hero" : "glass"}
                    className="w-full"
                    size="lg"
                    onClick={() => handleSubscribe(plan.name)}
                  >
                    {plan.cta}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="glass-card rounded-2xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">{t("premium.summary")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-xl bg-secondary/50">
                <User className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">{t("profiles.player.title")}</h3>
                <p className="text-2xl font-bold text-primary">R$ 10,00</p>
                <p className="text-sm text-muted-foreground">{t("premium.plans.month")}</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-secondary/50">
                <GraduationCap className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">{t("nav.coaches")}</h3>
                <p className="text-2xl font-bold text-primary">R$ 10,00</p>
                <p className="text-sm text-muted-foreground">{t("premium.plans.month")}</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-secondary/50">
                <Building2 className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">{t("profiles.club.title")}</h3>
                <p className="text-2xl font-bold text-primary">R$ 50,00</p>
                <p className="text-sm text-muted-foreground">{t("premium.plans.month")}</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-secondary/50">
                <Users className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">{t("profiles.agent.title")}</h3>
                <p className="text-2xl font-bold text-primary">R$ 50,00</p>
                <p className="text-sm text-muted-foreground">{t("premium.plans.month")}</p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              {t("premium.featuresTitle")} <span className="gradient-text">Premium</span>?
            </h2>
            <p className="text-muted-foreground">
              {t("premium.featuresSubtitle")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 text-center card-hover"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-orange-light flex items-center justify-center mx-auto mb-4 shadow-lg glow-orange">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* FAQ CTA */}
          <div className="mt-24 text-center">
            <p className="text-muted-foreground mb-4">
              {t("premium.faq")}
            </p>
            <Link to="/faq">
              <Button variant="glass" size="lg">
                {t("premium.viewFaq")}
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Premium;
