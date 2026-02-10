import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { POSITIONS, COUNTRIES, LEVELS, STATUSES } from '@/data/mockData';

interface PlayerFiltersProps {
  filters: {
    position: string;
    country: string;
    level: string;
    status: string;
    minAge: string;
    maxAge: string;
    minHeight: string;
    maxHeight: string;
    dominantHand: string;
  };
  onFiltersChange: (filters: PlayerFiltersProps['filters']) => void;
  onClearFilters: () => void;
}

const PlayerFilters = ({ filters, onFiltersChange, onClearFilters }: PlayerFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof typeof filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="space-y-4">
      {/* Quick Position Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateFilter('position', '')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filters.position === ''
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-primary/20'
          }`}
        >
          Todas
        </button>
        {POSITIONS.map((pos) => (
          <button
            key={pos}
            onClick={() => updateFilter('position', pos)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filters.position === pos
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-primary/20'
            }`}
          >
            {pos}
          </button>
        ))}
      </div>

      {/* Expand/Collapse Advanced Filters */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Filtros Avançados
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-1 text-muted-foreground hover:text-destructive"
          >
            <X className="w-3 h-3" />
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-secondary/50">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">País</Label>
            <select
              value={filters.country}
              onChange={(e) => updateFilter('country', e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm"
            >
              <option value="">Todos</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Nível</Label>
            <select
              value={filters.level}
              onChange={(e) => updateFilter('level', e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm"
            >
              <option value="">Todos</option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Status</Label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm"
            >
              <option value="">Todos</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Mão Dominante</Label>
            <select
              value={filters.dominantHand}
              onChange={(e) => updateFilter('dominantHand', e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm"
            >
              <option value="">Todas</option>
              <option value="Destro">Destro</option>
              <option value="Canhoto">Canhoto</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Idade Mínima</Label>
            <Input
              type="number"
              value={filters.minAge}
              onChange={(e) => updateFilter('minAge', e.target.value)}
              placeholder="18"
              className="h-10 bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Idade Máxima</Label>
            <Input
              type="number"
              value={filters.maxAge}
              onChange={(e) => updateFilter('maxAge', e.target.value)}
              placeholder="40"
              className="h-10 bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Altura Mín (cm)</Label>
            <Input
              type="number"
              value={filters.minHeight}
              onChange={(e) => updateFilter('minHeight', e.target.value)}
              placeholder="170"
              className="h-10 bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Altura Máx (cm)</Label>
            <Input
              type="number"
              value={filters.maxHeight}
              onChange={(e) => updateFilter('maxHeight', e.target.value)}
              placeholder="210"
              className="h-10 bg-background"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerFilters;
