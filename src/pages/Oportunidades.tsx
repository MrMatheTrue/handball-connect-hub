import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getOpportunities, getClubs, COUNTRIES, POSITIONS } from "@/data/mockData";
import { Search, Filter, MapPin, Clock, Star, Lock, ChevronDown, ChevronLeft, ChevronRight, Briefcase, Plus, X } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 6;

const Oportunidades = () => {
  const { t } = useTranslation();
  const { currentUser, isAdmin } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [positionFilter, setPositionFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const allOpportunities = getOpportunities();
  const clubs = getClubs();

  // Helper to get club details
  const getClubDetails = (clubId: string) => {
    return clubs.find(c => c.id === clubId);
  };

  // Filter opportunities
  const filteredOpportunities = useMemo(() => {
    return allOpportunities.filter(opp => {
      const club = getClubDetails(opp.clubId);
      const matchesSearch = !searchQuery ||
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.clubName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPosition = !positionFilter || opp.position === positionFilter;
      const matchesCountry = !countryFilter || opp.location.includes(countryFilter);
      const matchesType = !typeFilter || opp.type === typeFilter;

      return matchesSearch && matchesPosition && matchesCountry && matchesType;
    });
  }, [allOpportunities, searchQuery, positionFilter, countryFilter, typeFilter, clubs]);

  // Pagination
  const totalPages = Math.ceil(filteredOpportunities.length / ITEMS_PER_PAGE);
  const paginatedOpportunities = filteredOpportunities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setPositionFilter("");
    setCountryFilter("");
    setTypeFilter("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const hasActiveFilters = !!positionFilter || !!countryFilter || !!typeFilter;

  // Calculate days ago from date
  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const canPublish = isAdmin || (currentUser && (currentUser.type === 'club' || currentUser.type === 'agent'));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              {t("opps.badge")}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-4">
              {t("opps.title")} <span className="gradient-text">{t("opps.highlight")}</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {t("opps.subtitle")}
            </p>
          </div>

          {/* Actions */}
          {canPublish && (
            <div className="flex justify-end mb-6">
              <Link to="/publicar-vaga">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  {t("listing.publishOpportunity", "Publicar Vaga")}
                </Button>
              </Link>
            </div>
          )}

          {/* Premium Banner */}
          {(!currentUser || !currentUser.isPremium) && (
            <div className="glass-card rounded-2xl p-6 mb-8 border-accent-glow flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-light flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t("opps.premiumLock")}</h3>
                  <p className="text-sm text-muted-foreground">{t("opps.perksSubtitle")}</p>
                </div>
              </div>
              <Link to="/premium">
                <Button variant="hero">
                  {t("opps.perksCta")}
                </Button>
              </Link>
            </div>
          )}

          {/* Search and Filters */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder={t("listing.searchOppsPlaceholder")}
                  className="pl-12 h-12 bg-secondary border-border"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <Button
                variant="glass"
                className="h-12 gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                {t("listing.filters")}
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Quick Position Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => { setPositionFilter(""); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!positionFilter
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-primary/20"
                  }`}
              >
                {t("listing.all", "Todas")}
              </button>
              {POSITIONS.map((pos) => (
                <button
                  key={pos}
                  onClick={() => { setPositionFilter(pos); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${positionFilter === pos
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-primary/20"
                    }`}
                >
                  {pos}
                </button>
              ))}
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">{t("listing.country")}</label>
                    <Select value={countryFilter} onValueChange={(value) => { setCountryFilter(value); setCurrentPage(1); }}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder={t("listing.allCountries")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{t("listing.allCountries")}</SelectItem>
                        {COUNTRIES.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">{t("listing.type")}</label>
                    <Select value={typeFilter} onValueChange={(value) => { setTypeFilter(value); setCurrentPage(1); }}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder={t("listing.allTypes", "Todos os tipos")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{t("listing.allTypes", "Todos os tipos")}</SelectItem>
                        <SelectItem value="player">{t("profiles.player.title")}</SelectItem>
                        <SelectItem value="coach">{t("nav.coaches")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">{t("listing.activeFilters", "Filtros ativos:")}</span>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      {t("listing.clear")}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              <span className="text-foreground font-semibold">{filteredOpportunities.length}</span> {t("opps.found", { count: filteredOpportunities.length })}
            </p>
          </div>

          {/* Opportunities List */}
          <div className="space-y-4">
            {paginatedOpportunities.map((opp) => {
              const club = getClubDetails(opp.clubId);
              const daysAgo = getDaysAgo(opp.createdAt);

              return (
                <Link
                  to={`/oportunidade/${opp.id}`}
                  key={opp.id}
                  className="group glass-card rounded-2xl p-6 card-hover border-accent-glow block"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-orange-light/20 flex items-center justify-center flex-shrink-0 border border-primary/20 overflow-hidden">
                        {currentUser?.isPremium && club?.logoUrl ? (
                          <img src={club.logoUrl} alt={club.name} className="w-full h-full object-cover" />
                        ) : (
                          <Briefcase className="w-6 h-6 text-primary" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {opp.title}
                          </h3>
                          {opp.featured && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                              <Star className="w-3 h-3 fill-primary" />
                              {t("opps.featured")}
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {currentUser?.isPremium ? (club?.name || "Clube") : t("opps.premiumLock")}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {opp.location}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {t("opps.daysAgo", { count: daysAgo })}
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-secondary text-xs font-medium text-foreground">
                            {opp.type === 'player' ? t("profiles.player.title") : t("nav.coaches")}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-xs font-medium text-primary">
                            {opp.position}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 lg:flex-shrink-0">
                      {currentUser?.isPremium ? (
                        <>
                          <Button variant="glass" size="sm">
                            {t("opps.viewDetails")}
                          </Button>
                          <Button variant="hero" size="sm">
                            {t("opps.apply")}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="glass" size="sm" className="gap-1">
                            <Lock className="w-3 h-3" />
                            {t("opps.viewDetails")}
                          </Button>
                          <Button variant="hero" size="sm" className="gap-1">
                            <Lock className="w-3 h-3" />
                            {t("opps.apply")}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Empty State */}
          {filteredOpportunities.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("listing.noResults")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("listing.noResultsDesc", "Tente ajustar os filtros ou fazer uma busca diferente.")}
              </p>
              <Button variant="outline" onClick={clearFilters}>
                {t("listing.clear")}
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Oportunidades;
