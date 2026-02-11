import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPlayers, POSITIONS, COUNTRIES, LEVELS, STATUSES } from "@/data/mockData";
import { Search, Filter, MapPin, Shield, Crown, ChevronDown, ChevronLeft, ChevronRight, X, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 8;

const Jogadores = () => {
  const { t } = useTranslation();
  const { isLoggedIn } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [positionFilter, setPositionFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const allPlayers = getPlayers();

  // Filter players
  const filteredPlayers = useMemo(() => {
    return allPlayers.filter(player => {
      const matchesSearch = !searchQuery ||
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.city?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPosition = !positionFilter || player.position === positionFilter;
      const matchesCountry = !countryFilter || player.nationality === countryFilter;
      const matchesLevel = !levelFilter || player.level === levelFilter;
      const matchesStatus = !statusFilter || player.status === statusFilter;

      return matchesSearch && matchesPosition && matchesCountry && matchesLevel && matchesStatus;
    });
  }, [allPlayers, searchQuery, positionFilter, countryFilter, levelFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredPlayers.length / ITEMS_PER_PAGE);
  const paginatedPlayers = filteredPlayers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setPositionFilter("");
    setCountryFilter("");
    setLevelFilter("");
    setStatusFilter("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const hasActiveFilters = positionFilter || countryFilter || levelFilter || statusFilter;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponível": return "bg-green-500/20 text-green-400";
      case "Em negociação": return "bg-yellow-500/20 text-yellow-400";
      case "Contrato atual": return "bg-blue-500/20 text-blue-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const calculateAge = (birthDate: string) => {
    return Math.floor((new Date().getTime() - new Date(birthDate).getTime()) / 31557600000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                {t("nav.players")}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-4">
                {t("listing.searchTitle", "Encontre")} <span className="gradient-text">{t("hero.title2")}</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                {t("listing.playersSubtitle", "Explore perfis de jogadores de handebol de todo o mundo. Use os filtros para encontrar o talento ideal.")}
              </p>
            </div>
            {!isLoggedIn && (
              <Link to="/cadastro">
                <Button variant="hero" className="gap-2">
                  <Plus className="w-4 h-4" />
                  {t("listing.createProfile")}
                </Button>
              </Link>
            )}
          </div>

          {/* Search and Filters */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder={t("listing.searchPlayersPlaceholder")}
                  className="pl-12 h-12 bg-secondary border-border"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="glass"
                  className="h-12 gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4" />
                  {t("listing.filters")}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>
                {hasActiveFilters && (
                  <Button variant="ghost" className="h-12 gap-2" onClick={clearFilters}>
                    <X className="w-4 h-4" />
                    {t("listing.clear")}
                  </Button>
                )}
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
                <Select value={positionFilter} onValueChange={(v) => { setPositionFilter(v === "all" ? "" : v); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("listing.position", "Posição")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("listing.allPositions", "Todas as posições")}</SelectItem>
                    {POSITIONS.map(pos => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={countryFilter} onValueChange={(v) => { setCountryFilter(v === "all" ? "" : v); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("listing.country", "País")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("listing.allCountries", "Todos os países")}</SelectItem>
                    {COUNTRIES.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={levelFilter} onValueChange={(v) => { setLevelFilter(v === "all" ? "" : v); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("listing.level", "Nível")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("listing.allLevels", "Todos os níveis")}</SelectItem>
                    {LEVELS.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("listing.allStatuses", "Todos os status")}</SelectItem>
                    {STATUSES.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {POSITIONS.map((pos) => (
                <button
                  key={pos}
                  onClick={() => { setPositionFilter(positionFilter === pos ? "" : pos); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${positionFilter === pos
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-primary/20'
                    }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              <span className="text-foreground font-semibold">{filteredPlayers.length}</span> {t("listing.found", { count: filteredPlayers.length })}
            </p>
          </div>

          {/* Players Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedPlayers.map((player) => (
              <Link
                key={player.id}
                to={`/jogador/${player.id}`}
                className="group relative glass-card rounded-2xl overflow-hidden card-hover"
              >
                {player.isPremiumProfile && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full premium-badge text-xs font-semibold">
                      <Crown className="w-3 h-3" />
                      PRO
                    </div>
                  </div>
                )}

                <div className="relative h-40 bg-gradient-to-br from-primary/20 to-orange-light/10 flex items-center justify-center">
                  {player.photoUrl ? (
                    <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-orange-light/20 flex items-center justify-center border-2 border-primary/30">
                      <span className="font-display text-2xl text-primary">
                        {player.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {player.name}
                      </h3>
                      <p className="text-primary text-sm font-medium">
                        {player.position}
                      </p>
                    </div>
                  </div>

                  <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium mb-3 ${getStatusColor(player.status)}`}>
                    {player.status}
                  </span>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {player.nationality}
                    </div>
                    {player.height > 0 && <span>{player.height}cm</span>}
                    {player.birthDate && <span>{calculateAge(player.birthDate)} {t("listing.years", "anos")}</span>}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Shield className="w-3 h-3" />
                      {player.level}
                    </span>
                    <span className="text-primary text-xs font-medium">
                      {t("listing.viewProfile")} →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredPlayers.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">{t("listing.noResults")}</p>
              <Button variant="glass" onClick={clearFilters}>{t("listing.clear")}</Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button
                variant="glass"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "hero" : "glass"}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="glass"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Jogadores;
