import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAgents, COUNTRIES } from "@/data/mockData";
import { Search, Filter, MapPin, Users, Briefcase, ChevronDown, ChevronLeft, ChevronRight, X, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 6;

const Agentes = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [countryFilter, setCountryFilter] = useState("");

  const allAgents = getAgents();

  // Filter agents
  const filteredAgents = useMemo(() => {
    return allAgents.filter(agent => {
      const matchesSearch = !searchQuery ||
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.agency?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.country.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCountry = !countryFilter || agent.country === countryFilter;

      return matchesSearch && matchesCountry;
    });
  }, [allAgents, searchQuery, countryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAgents.length / ITEMS_PER_PAGE);
  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setCountryFilter("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const hasActiveFilters = !!countryFilter;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              {t("nav.agents")}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-4">
              {t("listing.searchTitle", "Encontre")} <span className="gradient-text">{t("nav.agents")}</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {t("listing.agentsSubtitle", "Encontre agentes especializados em handebol para impulsionar sua carreira ou descobrir novos talentos.")}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end mb-6">
            <Link to="/criar-agente">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                {t("listing.createProfile", "Cadastrar Perfil")}
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder={t("listing.searchAgentsPlaceholder", "Buscar agentes...")}
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

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">{t("listing.country")}</label>
                    <Select value={countryFilter} onValueChange={(value) => { setCountryFilter(value === "all" ? "" : value); setCurrentPage(1); }}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder={t("listing.allCountries")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("listing.allCountries")}</SelectItem>
                        {COUNTRIES.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="mt-4 flex items-center gap-2">
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
              <span className="text-foreground font-semibold">{filteredAgents.length}</span> {t("listing.found", { count: filteredAgents.length })}
            </p>
          </div>

          {/* Agents Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedAgents.map((agent) => (
              <Link
                to={`/agente/${agent.id}`}
                key={agent.id}
                className="group glass-card rounded-2xl overflow-hidden card-hover"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-orange-light/20 flex items-center justify-center border border-primary/30 flex-shrink-0 overflow-hidden">
                      {agent.photoUrl ? (
                        <img src={agent.photoUrl} alt={agent.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-display text-xl text-primary">
                          {agent.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {agent.name}
                      </h3>
                      {agent.agency && (
                        <p className="text-primary text-sm font-medium">
                          {agent.agency}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {agent.country}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 py-4 border-y border-border mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-lg font-semibold text-foreground">{agent.clientIds?.length || 0}</p>
                        <p className="text-xs text-muted-foreground">{t("listing.athletes")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-lg font-semibold text-foreground">{agent.successfulPlacements || 0}</p>
                        <p className="text-xs text-muted-foreground">{t("listing.experience", "Colocações")}</p>
                      </div>
                    </div>
                  </div>

                  <Button variant="glass" className="w-full">
                    {t("listing.viewProfile")}
                  </Button>
                </div>
              </Link>
            ))}
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
          {filteredAgents.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("listing.noResults")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("listing.noResultsDesc")}
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

export default Agentes;
