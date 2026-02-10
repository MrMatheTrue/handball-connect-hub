import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Shield, Crown } from "lucide-react";

const FeaturedPlayersSection = () => {
  const players = [
    {
      id: 1,
      name: "Lucas Santos",
      position: "Armador Central",
      country: "Brasil",
      height: "192cm",
      age: 24,
      status: "Disponível",
      level: "Profissional",
      isPremium: true,
    },
    {
      id: 2,
      name: "María González",
      position: "Ponta Esquerda",
      country: "Argentina",
      height: "178cm",
      age: 22,
      status: "Disponível",
      level: "Profissional",
      isPremium: true,
    },
    {
      id: 3,
      name: "Pedro Almeida",
      position: "Goleiro",
      country: "Portugal",
      height: "195cm",
      age: 28,
      status: "Em negociação",
      level: "Profissional",
      isPremium: false,
    },
    {
      id: 4,
      name: "Sofia Martins",
      position: "Pivô",
      country: "Brasil",
      height: "185cm",
      age: 26,
      status: "Disponível",
      level: "Semiprofissional",
      isPremium: false,
    },
    {
      id: 5,
      name: "Carlos Fernández",
      position: "Armador Direito",
      country: "Espanha",
      height: "188cm",
      age: 25,
      status: "Disponível",
      level: "Profissional",
      isPremium: true,
    },
    {
      id: 6,
      name: "Ana Paula Silva",
      position: "Ponta Direita",
      country: "Brasil",
      height: "175cm",
      age: 23,
      status: "Contrato atual",
      level: "Profissional",
      isPremium: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponível":
        return "bg-green-500/20 text-green-400";
      case "Em negociação":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Talentos
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4">
              Jogadores em{" "}
              <span className="gradient-text">Destaque</span>
            </h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-xl">
              Descubra os talentos que estão buscando novas oportunidades no handebol.
            </p>
          </div>
          <Link to="/jogadores">
            <Button variant="glass" size="lg" className="group">
              Ver Todos os Jogadores
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Players Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player, index) => (
            <div
              key={player.id}
              className="group relative glass-card rounded-2xl overflow-hidden card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Premium Badge */}
              {player.isPremium && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full premium-badge text-xs font-semibold">
                    <Crown className="w-3 h-3" />
                    PRO
                  </div>
                </div>
              )}

              {/* Player Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-orange-light/10 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-orange-light/20 flex items-center justify-center border-2 border-primary/30">
                  <span className="font-display text-3xl text-primary">
                    {player.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {player.name}
                    </h3>
                    <p className="text-primary text-sm font-medium">
                      {player.position}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getStatusColor(player.status)}`}>
                    {player.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {player.country}
                  </div>
                  <span>{player.height}</span>
                  <span>{player.age} anos</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Shield className="w-3.5 h-3.5" />
                    {player.level}
                  </span>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                    Ver Perfil
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPlayersSection;
