import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, ArrowRight, Star, Lock } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "react-i18next";

const OpportunitiesSection = () => {
  const { isPremium } = useUser();
  const { t } = useTranslation();
  const opportunities = [
    {
      id: 1,
      title: "Armador Esquerdo",
      club: "Handebol Barcelona",
      location: "Barcelona, Espanha",
      type: "Profissional",
      daysAgo: 2,
      featured: true,
    },
    {
      id: 2,
      title: "Goleiro Experiente",
      club: "THW Kiel",
      location: "Kiel, Alemanha",
      type: "Profissional",
      daysAgo: 3,
      featured: true,
    },
    {
      id: 3,
      title: "Pivô para Temporada 2024",
      club: "Paris Saint-Germain Hand",
      location: "Paris, França",
      type: "Profissional",
      daysAgo: 5,
      featured: false,
    },
    {
      id: 4,
      title: "Ponta Direita",
      club: "EC Pinheiros",
      location: "São Paulo, Brasil",
      type: "Semiprofissional",
      daysAgo: 1,
      featured: false,
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              {t("opps.badge")}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4">
              {t("opps.title")}{" "}
              <span className="gradient-text">{t("opps.highlight")}</span>
            </h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-xl">
              {t("opps.subtitle")}
            </p>
          </div>
          <Link to="/oportunidades">
            <Button variant="glass" size="lg" className="group">
              {t("opps.viewAll")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Opportunities Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {opportunities.map((opp, index) => (
            <div
              key={opp.id}
              className="group relative glass-card rounded-2xl p-6 card-hover border-accent-glow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Featured Badge */}
              {opp.featured && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                  <Star className="w-3 h-3 fill-primary" />
                  {t("opps.featured")}
                </div>
              )}

              {/* Content */}
              <div className="flex items-start gap-4">
                {/* Club Avatar Placeholder */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-orange-light/20 flex items-center justify-center flex-shrink-0 border border-primary/20">
                  <span className="font-display text-lg text-primary">
                    {isPremium ? opp.club.substring(0, 2).toUpperCase() : "?"}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {opp.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {isPremium ? opp.club : "Clube (Plano Premium)"}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {opp.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {t("opps.daysAgo", { count: opp.daysAgo })}
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-secondary text-xs font-medium text-foreground">
                      {opp.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Premium Lock Indicator */}
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  {t("opps.premiumLock")}
                </span>
                <Link to={`/oportunidade/${opp.id}`}>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                    {t("opps.viewDetails")}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Premium CTA */}
        <div className="mt-12 glass-card rounded-2xl p-8 lg:p-12 border-accent-glow text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-orange-light mb-6 shadow-lg glow-orange">
              <Star className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              {t("opps.perksTitle")} <span className="gradient-text">Premium</span>
            </h3>
            <p className="text-muted-foreground mb-8">
              {t("opps.perksSubtitle")}
            </p>
            <Link to="/premium">
              <Button variant="hero" size="xl">
                {t("opps.perksCta")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpportunitiesSection;
