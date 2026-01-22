import { useState } from "react";
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
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

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
      price: billingCycle === "annual" ? "R$ 10,00" : "R$ 28,99",
      period: billingCycle === "annual" ? "/mês (anual)" : "/mês",
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
      cta: isPremium && (userType === 'player') ? t("premium.plans.current") : t("premium.plans.subscribe"),
      href: "/cadastro?plan=premium-athlete",
      popular: true,
    },
    {
      name: "Técnico / Clube / Agente",
      price: billingCycle === "annual" ? "R$ 38,99" : "R$ 50,00",
      period: billingCycle === "annual" ? "/mês (anual)" : "/mês",
      description: "Para profissionais, clubes e agentes que buscam o próximo nível",
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
      cta: isPremium && (userType === 'club' || userType === 'agent' || userType === 'coach') ? t("premium.plans.current") : t("premium.plans.subscribe"),
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

  const handleSubscribe = (planName: string) => {
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
            <p className="text-muted-foreground text-lg mb-8">
              {t("premium.subtitle")}
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>Mensal</span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="relative w-14 h-7 bg-secondary rounded-full p-1 transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-primary rounded-full transition-transform ${billingCycle === 'annual' ? 'translate-x-7' : ''}`} />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-foreground' : 'text-muted-foreground'}`}>Anual (Economia)</span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-24">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative glass-card rounded-2xl p-8 flex flex-col ${plan.popular ? "border-2 border-primary glow-orange" : "border border-border"
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full premium-badge text-sm font-semibold whitespace-nowrap">
                      {t("premium.plans.popular")}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    {plan.icon && <plan.icon className="w-5 h-5 text-primary" />}
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground tracking-tight">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  {billingCycle === "annual" && plan.name !== t("premium.plans.free") && (
                    <p className="text-xs text-primary font-medium mt-1">12 parcelas sem juros</p>
                  )}
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground line-through decoration-muted-foreground/50">
                      <Check className="w-5 h-5 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>

                {plan.cta === t("premium.plans.current") ? (
                  <Button variant="glass" className="w-full mt-auto" size="lg" disabled>
                    <Crown className="w-4 h-4 mr-2" />
                    {plan.cta}
                  </Button>
                ) : (
                  <Button
                    variant={plan.popular ? "hero" : "glass"}
                    className="w-full mt-auto"
                    size="lg"
                    onClick={() => handleSubscribe(plan.name)}
                  >
                    {plan.cta}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="glass-card rounded-2xl p-8 mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            <h2 className="text-2xl font-bold text-center mb-10 relative z-10">{t("premium.summary")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              <div className="text-center p-6 rounded-xl bg-secondary/30 border border-border/50 card-hover">
                <User className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{t("profiles.player.title")}</h3>
                <p className="text-2xl font-bold text-primary">{billingCycle === 'monthly' ? 'R$ 28,99' : 'R$ 10,00'}</p>
                <p className="text-xs text-muted-foreground mt-1">/{t("premium.plans.month")}</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-secondary/30 border border-border/50 card-hover ring-1 ring-primary/20">
                <GraduationCap className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{t("nav.coaches")}</h3>
                <p className="text-2xl font-bold text-primary">{billingCycle === 'monthly' ? 'R$ 50,00' : 'R$ 38,99'}</p>
                <p className="text-xs text-muted-foreground mt-1">/{t("premium.plans.month")}</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-secondary/30 border border-border/50 card-hover ring-1 ring-primary/20">
                <Building2 className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{t("profiles.club.title")}</h3>
                <p className="text-2xl font-bold text-primary">{billingCycle === 'monthly' ? 'R$ 50,00' : 'R$ 38,99'}</p>
                <p className="text-xs text-muted-foreground mt-1">/{t("premium.plans.month")}</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-secondary/30 border border-border/50 card-hover ring-1 ring-primary/20">
                <Users className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{t("profiles.agent.title")}</h3>
                <p className="text-2xl font-bold text-primary">{billingCycle === 'monthly' ? 'R$ 50,00' : 'R$ 38,99'}</p>
                <p className="text-xs text-muted-foreground mt-1">/{t("premium.plans.month")}</p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              {t("premium.featuresTitle")} <span className="gradient-text">Premium</span>?
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("premium.featuresSubtitle")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-8 text-center card-hover border border-border/50"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-orange-light flex items-center justify-center mx-auto mb-6 shadow-xl glow-orange">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* FAQ CTA */}
          <div className="mt-32 text-center bg-secondary/20 py-12 rounded-3xl border border-border/30">
            <p className="text-muted-foreground mb-6 text-lg">
              {t("premium.faq")}
            </p>
            <Link to="/faq">
              <Button variant="hero" size="lg" className="px-10">
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
