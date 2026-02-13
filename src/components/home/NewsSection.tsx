import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { useTranslation } from "react-i18next";

const NewsSection = () => {
  const { t } = useTranslation();

  const news = [
    {
      id: 1,
      title: "Brasil conquista vaga olímpica no handebol masculino",
      excerpt: "A seleção brasileira masculina de handebol garantiu sua vaga para os Jogos Olímpicos após campanha histórica no torneio qualificatório.",
      category: "Seleções",
      author: "Redação HandZone",
      date: "15 Jan 2024",
      readTime: "5 min",
      featured: true,
    },
    {
      id: 2,
      title: "Novo formato da Liga Europeia é anunciado",
      excerpt: "A EHF divulgou as mudanças no formato da competição que entrarão em vigor na próxima temporada.",
      category: "Ligas",
      author: "Redação HandZone",
      date: "14 Jan 2024",
      readTime: "3 min",
      featured: false,
    },
    {
      id: 3,
      title: "Transferências: Os principais movimentos do mercado",
      excerpt: "Confira as principais contratações e transferências dos clubes brasileiros e europeus nesta janela.",
      category: "Transferências",
      author: "Redação HandZone",
      date: "13 Jan 2024",
      readTime: "8 min",
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
              {t("news.badge")}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4">
              {t("news.title")}{" "}
              <span className="gradient-text">{t("news.highlight")}</span>
            </h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-xl">
              {t("news.subtitle")}
            </p>
          </div>
          <Link to="/noticias">
            <Button variant="glass" size="lg" className="group">
              {t("news.viewAll")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* News Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Featured Article */}
          <div className="group glass-card rounded-2xl overflow-hidden card-hover lg:row-span-2">
            <div className="relative h-64 lg:h-80 bg-gradient-to-br from-primary/30 to-orange-light/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <img src="/logo.png" alt="HZ" className="w-32 h-32 object-contain opacity-50" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  {news[0].category}
                </span>
              </div>
            </div>
            <div className="p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-4">
                {news[0].title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {news[0].excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {news[0].author}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {news[0].date}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {news[0].readTime}
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Articles */}
          {news.slice(1).map((article) => (
            <div
              key={article.id}
              className="group glass-card rounded-2xl overflow-hidden card-hover flex flex-col sm:flex-row"
            >
              <div className="relative w-full sm:w-48 h-40 sm:h-auto bg-gradient-to-br from-primary/20 to-orange-light/10 flex-shrink-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src="/logo.png" alt="HZ" className="w-16 h-16 object-contain opacity-40" />
                </div>
              </div>
              <div className="p-6 flex-1">
                <span className="inline-block px-2 py-0.5 rounded-md bg-primary/20 text-primary text-xs font-medium mb-3">
                  {article.category}
                </span>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {article.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
