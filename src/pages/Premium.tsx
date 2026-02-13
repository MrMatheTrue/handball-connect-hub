import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap, MessageSquare, Briefcase, Shield, Crown, User, Building2, Users, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const Premium = () => {
  const { t } = useTranslation();
  const { isPremium, userType } = useUser();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const pricing = {
    monthly: { athlete: 25, coach: 50, club: 50, agent: 50 },
    annual: { athlete: 12.99, coach: 38.99, club: 38.99, agent: 38.99 },
  };

  const savingsPercent = {
    athlete: Math.round((1 - 12.99 / 25) * 100),
    coach: Math.round((1 - 38.99 / 50) * 100),
    club: Math.round((1 - 38.99 / 50) * 100),
    agent: Math.round((1 - 38.99 / 50) * 100),
  };

  const plans = [
    {
      name: t("premium.plans.free"),
      price: "R$ 0",
      period: t("premium.plans.forever"),
      description: t("premium.plans.freeDesc", "Perfeito para começar sua jornada no handebol"),
      features: [
        "Criar perfil completo",
        "Navegação de todos os perfis",
        "Busca básica de jogadores e clubes",
        "Acesso às notícias",
        "Ver lista de oportunidades",
      ],
      limitations: [
        "Sem acesso ao chat",
        "Sem dados de contato",
        "Sem candidatura a vagas",
      ],
      cta: "Criar Conta Grátis",
      href: "/cadastro",
      popular: false,
    },
    {
      name: "Premium Atleta",
      price: `R$ ${billingPeriod === 'monthly' ? pricing.monthly.athlete.toFixed(2).replace('.', ',') : pricing.annual.athlete.toFixed(2).replace('.', ',')}`,
      period: billingPeriod === 'monthly' ? '/mês' : '/mês (anual)',
      description: "Tudo que você precisa para alavancar sua carreira",
      icon: User,
      savings: billingPeriod === 'annual' ? savingsPercent.athlete : 0,
      features: [
        "Tudo do plano Gratuito",
        "Chat com clubes, técnicos e agentes",
        "Ver dados de contato de clubes/agentes",
        "Candidatura ilimitada a vagas",
        "Perfil em destaque",
        "Suporte prioritário",
      ],
      limitations: [],
      cta: isPremium && userType === 'player' ? "Plano Atual" : "Assinar Agora",
      href: "/cadastro?plan=premium-athlete",
      popular: true,
    },
    {
      name: "Premium Profissional",
      price: `R$ ${billingPeriod === 'monthly' ? pricing.monthly.club.toFixed(2).replace('.', ',') : pricing.annual.club.toFixed(2).replace('.', ',')}`,
      period: billingPeriod === 'monthly' ? '/mês' : '/mês (anual)',
      description: "Para clubes, técnicos e agentes que buscam talentos",
      icon: Building2,
      savings: billingPeriod === 'annual' ? savingsPercent.club : 0,
      features: [
        "Tudo do plano Gratuito",
        "Acesso completo a dados de atletas",
        "Publicar vagas ilimitadas",
        "Gerenciar candidaturas",
        "Busca avançada de talentos",
        "Mensagens ilimitadas",
        "Contato direto com atletas",
      ],
      limitations: [],
      cta: isPremium && (userType === 'club' || userType === 'agent' || userType === 'coach') ? "Plano Atual" : "Assinar Agora",
      href: "/cadastro?plan=premium-pro",
      popular: false,
    },
  ];

  const features = [
    { icon: MessageSquare, title: "Chat Premium", description: "Comunique-se diretamente com clubes, jogadores e agentes sem limitações." },
    { icon: Briefcase, title: "Vagas Exclusivas", description: "Acesse detalhes completos de todas as oportunidades e candidate-se com um clique." },
    { icon: Star, title: "Perfil em Destaque", description: "Seu perfil aparece em primeiro nos resultados de busca e com badge Premium." },
    { icon: Shield, title: "Suporte Prioritário", description: "Atendimento dedicado para resolver suas dúvidas rapidamente." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {isPremium && (
            <div className="mb-8 p-4 rounded-xl bg-primary/10 border border-primary/30 text-center">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Crown className="w-5 h-5" />
                <span className="font-semibold">{t("premium.status")}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{t("premium.statusDesc")}</p>
            </div>
          )}

          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30 mb-6">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">{t("premium.badge")}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              {t("premium.title")} <span className="gradient-text">{t("premium.highlight")}</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8">{t("premium.subtitle")}</p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-3 p-1.5 rounded-xl bg-secondary/50 border border-border">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${billingPeriod === 'monthly' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${billingPeriod === 'annual' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Anual
                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">-48%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-24">
            {plans.filter(plan => {
              if (userType && ['club', 'coach', 'agent'].includes(userType) && plan.price === "R$ 0") {
                return false;
              }
              return true;
            }).map((plan, index) => (
              <div
                key={index}
                className={`relative glass-card rounded-2xl p-8 ${plan.popular ? "border-2 border-primary glow-orange" : "border border-border"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full premium-badge text-sm font-semibold">
                      {t("premium.plans.popular")}
                    </span>
                  </div>
                )}

                {plan.savings > 0 && (
                  <div className="absolute -top-3 right-4">
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">
                      Economize {plan.savings}%
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

                {plan.cta === "Plano Atual" ? (
                  <Button variant="glass" className="w-full" size="lg" disabled>
                    <Crown className="w-4 h-4 mr-2" /> {plan.cta}
                  </Button>
                ) : (
                  <Link to={plan.href}>
                    <Button variant={plan.popular ? "hero" : "glass"} className="w-full" size="lg">
                      {plan.cta}
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="glass-card rounded-2xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">{t("premium.summary")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: User, label: "Atleta", monthly: pricing.monthly.athlete, annual: pricing.annual.athlete },
                { icon: GraduationCap, label: "Técnico", monthly: pricing.monthly.coach, annual: pricing.annual.coach },
                { icon: Building2, label: "Clube", monthly: pricing.monthly.club, annual: pricing.annual.club },
                { icon: Users, label: "Agente", monthly: pricing.monthly.agent, annual: pricing.annual.agent },
              ].map((item, i) => (
                <div key={i} className="text-center p-6 rounded-xl bg-secondary/50">
                  <item.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">{item.label}</h3>
                  <p className="text-2xl font-bold text-primary">
                    R$ {(billingPeriod === 'monthly' ? item.monthly : item.annual).toFixed(2).replace('.', ',')}
                  </p>
                  <p className="text-sm text-muted-foreground">{billingPeriod === 'monthly' ? '/mês' : '/mês (anual)'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Por que ser <span className="gradient-text">Premium</span>?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="glass-card rounded-2xl p-6 text-center card-hover">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-orange-light flex items-center justify-center mx-auto mb-4 shadow-lg glow-orange">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-24 text-center">
            <p className="text-muted-foreground mb-4">{t("premium.faq")}</p>
            <Link to="/faq">
              <Button variant="glass" size="lg">{t("premium.viewFaq")}</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Premium;
