import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

const CTASection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Zap,
      title: t("cta.feat1.title", "Conexão Rápida"),
      description: t("cta.feat1.desc", "Encontre oportunidades e conecte-se diretamente com clubes e agentes."),
    },
    {
      icon: Shield,
      title: t("cta.feat2.title", "Perfis Verificados"),
      description: t("cta.feat2.desc", "Todos os perfis passam por verificação para garantir autenticidade."),
    },
    {
      icon: Globe,
      title: t("cta.feat3.title", "Alcance Global"),
      description: t("cta.feat3.desc", "Acesse oportunidades em clubes de todo o mundo."),
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-orange-light/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="glass-card rounded-3xl p-8 lg:p-16 border-accent-glow text-center">
          {/* Features */}
          <div className="grid sm:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-orange-light flex items-center justify-center mb-4 shadow-lg glow-orange">
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

          {/* Main CTA */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              {t("cta.title")}{" "}
              <span className="gradient-text">{t("cta.highlight")}</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/cadastro">
                <Button variant="hero" size="xl" className="group">
                  {t("cta.start")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/premium">
                <Button variant="glass" size="xl">
                  {t("cta.viewPlans")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
