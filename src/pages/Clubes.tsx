import { useState, useMemo } from "react";
import { useUser } from "@/contexts/UserContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getClubs, COUNTRIES } from "@/data/mockData";
import { Search, Filter, MapPin, Trophy, Users, ChevronDown, ChevronLeft, ChevronRight, X, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LEAGUES = [
  "Liga Nacional",
  "Liga Asobal",
  "Bundesliga",
  "Lidl Starligue",
];

const ITEMS_PER_PAGE = 6;

const Clubes = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [countryFilter, setCountryFilter] = useState("");
  const [leagueFilter, setLeagueFilter] = useState("");

  const allClubs = getClubs();

  // Filter clubs
  const filteredClubs = useMemo(() => {
    return allClubs.filter(club => {
      const matchesSearch = !searchQuery ||
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.league.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.city?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCountry = !countryFilter || club.country === countryFilter;
      const matchesLeague = !leagueFilter || club.league === leagueFilter;

      return matchesSearch && matchesCountry && matchesLeague;
    });
  }, [allClubs, searchQuery, countryFilter, leagueFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredClubs.length / ITEMS_PER_PAGE);
  const paginatedClubs = filteredClubs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setCountryFilter("");
    setLeagueFilter("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const hasActiveFilters = countryFilter || leagueFilter;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                {t("nav.clubs")}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-4">
                {t("listing.searchTitle", "Encontre")} <span className="gradient-text">{t("nav.clubs")}</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                {t("listing.clubsSubtitle", "Explore clubes de handebol de todo o mundo. Encontre equipes buscando novos talentos.")}
              </p>
            </div>
            {!useUser().isLoggedIn && (
              <Link to="/cadastro">
                <Button variant="hero" className="gap-2">
                  <Plus className="w-4 h-4" />
                  {t("listing.createProfile", "Cadastrar Clube")}
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
                  placeholder={t("listing.searchClubsPlaceholder", "Buscar clubes...")}
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
              <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                <Select value={countryFilter} onValueChange={(v) => { setCountryFilter(v === "all" ? "" : v); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("listing.country")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("listing.allCountries")}</SelectItem>
                    {COUNTRIES.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={leagueFilter} onValueChange={(v) => { setLeagueFilter(v === "all" ? "" : v); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("listing.league", "Liga")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("listing.allLeagues", "Todas as ligas")}</SelectItem>
                    {LEAGUES.map(league => (
                      <SelectItem key={league} value={league}>{league}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              <span className="text-foreground font-semibold">{filteredClubs.length}</span> {t("listing.found", { count: filteredClubs.length })}
            </p>
          </div>

          {/* Clubs Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedClubs.map((club) => (
              <Link
                key={club.id}
                to={`/clube/${club.id}`}
                className="group glass-card rounded-2xl overflow-hidden card-hover"
              >
                <div className="relative h-32 bg-gradient-to-br from-primary/30 to-orange-light/20 flex items-center justify-center">
                  {club.logoUrl ? (
                    <img src={club.logoUrl} alt={club.name} className="w-20 h-20 object-contain" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/40 to-orange-light/30 flex items-center justify-center border border-primary/30">
                      <span className="font-display text-2xl text-primary">
                        {club.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {club.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {club.city}, {club.country}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-primary" />
                      {club.league}
                    </div>
                    {club.playersCount && (
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        {club.playersCount} {t("listing.athletes")}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {club.founded ? `${t("listing.founded", "Fundado em")} ${club.founded}` : ''}
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
          {filteredClubs.length === 0 && (
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

export default Clubes;
