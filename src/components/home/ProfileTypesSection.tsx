import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Building2, Users, ArrowRight, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const ProfileTypesSection = () => {
  const { t } = useTranslation();

  const profiles = [
    {
      icon: User,
      title: t("profiles.player.title"),
      description: t("profiles.player.description"),
      features: [
        t("profiles.player.feat1"),
        t("profiles.player.feat2"),
        t("profiles.player.feat3"),
        t("profiles.player.feat4"),
      ],
      href: "/jogadores",
      cta: t("profiles.player.cta"),
      gradient: "from-primary to-orange-light",
    },
    {
      icon: Building2,
      title: t("profiles.club.title"),
      description: t("profiles.club.description"),
      features: [
        t("profiles.club.feat1"),
        t("profiles.club.feat2"),
        t("profiles.club.feat3"),
        t("profiles.club.feat4"),
      ],
      href: "/clubes",
      cta: t("profiles.club.cta"),
      gradient: "from-orange-light to-primary",
    },
    {
      icon: Users,
      title: t("profiles.agent.title"),
      description: t("profiles.agent.description"),
      features: [
        t("profiles.agent.feat1"),
        t("profiles.agent.feat2"),
        t("profiles.agent.feat3"),
        t("profiles.agent.feat4"),
      ],
      href: "/agentes",
      cta: t("profiles.agent.cta"),
      gradient: "from-primary via-orange-glow to-orange-light",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            {t("profiles.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            {t("profiles.title")}{" "}
            <span className="gradient-text">{t("profiles.highlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("profiles.subtitle")}
          </p>
        </div>

        {/* Profile Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {profiles.map((profile, index) => (
            <div
              key={index}
              className="group relative glass-card rounded-2xl p-8 card-hover border-accent-glow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${profile.gradient} flex items-center justify-center mb-6 shadow-lg glow-orange group-hover:scale-110 transition-transform`}>
                <profile.icon className="w-8 h-8 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {profile.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {profile.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {profile.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to={profile.href}>
                <Button variant="glass" className="w-full group/btn">
                  {profile.cta}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfileTypesSection;
