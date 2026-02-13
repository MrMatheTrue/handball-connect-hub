import React, { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Country, State, City } from "country-state-city";

interface LocationSelectorProps {
    country: string;
    state: string;
    city: string;
    onCountryChange: (value: string) => void;
    onStateChange: (value: string) => void;
    onCityChange: (value: string) => void;
    countryLabel?: string;
    stateLabel?: string;
    cityLabel?: string;
    className?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
    country,
    state,
    city,
    onCountryChange,
    onStateChange,
    onCityChange,
    countryLabel = "País",
    stateLabel = "Estado/Província",
    cityLabel = "Cidade",
    className = "",
}) => {
    const countries = useMemo(() => Country.getAllCountries(), []);

    // Resolve country to ISO code (handles both name and isoCode inputs)
    const countryCode = useMemo(() => {
        if (!country) return "";
        const byCode = countries.find(c => c.isoCode === country);
        if (byCode) return byCode.isoCode;
        const byName = countries.find(c => c.name.toLowerCase() === country.toLowerCase());
        return byName?.isoCode || "";
    }, [country, countries]);

    const availableStates = useMemo(() => {
        if (!countryCode) return [];
        return State.getStatesOfCountry(countryCode);
    }, [countryCode]);

    // Resolve state to ISO code
    const stateCode = useMemo(() => {
        if (!state || !countryCode) return "";
        const byCode = availableStates.find(s => s.isoCode === state);
        if (byCode) return byCode.isoCode;
        const byName = availableStates.find(s => s.name.toLowerCase() === state.toLowerCase());
        return byName?.isoCode || "";
    }, [state, availableStates, countryCode]);

    const availableCities = useMemo(() => {
        if (!countryCode || !stateCode) return [];
        return City.getCitiesOfState(countryCode, stateCode);
    }, [countryCode, stateCode]);

    const handleCountryChange = (isoCode: string) => {
        onCountryChange(isoCode); // Store ISO code directly
        onStateChange("");
        onCityChange("");
    };

    const handleStateChange = (isoCode: string) => {
        onStateChange(isoCode); // Store ISO code directly
        onCityChange("");
    };

    return (
        <div className={`grid sm:grid-cols-3 gap-4 ${className}`}>
            <div className="space-y-2">
                <Label>{countryLabel} *</Label>
                <Select value={countryCode || undefined} onValueChange={handleCountryChange}>
                    <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Selecione o País" />
                    </SelectTrigger>
                    <SelectContent>
                        {countries.map((c) => (
                            <SelectItem key={c.isoCode} value={c.isoCode}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>{stateLabel} *</Label>
                <Select
                    key={countryCode || "no-country"}
                    value={stateCode || undefined}
                    onValueChange={handleStateChange}
                    disabled={!countryCode || availableStates.length === 0}
                >
                    <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder={!countryCode ? "Selecione o País primeiro" : "Selecione o Estado"} />
                    </SelectTrigger>
                    <SelectContent>
                        {availableStates.map((s) => (
                            <SelectItem key={s.isoCode} value={s.isoCode}>{s.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>{cityLabel} *</Label>
                <Select
                    key={`${countryCode}-${stateCode}` || "no-state"}
                    value={city || undefined}
                    onValueChange={onCityChange}
                    disabled={!stateCode || availableCities.length === 0}
                >
                    <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder={!stateCode ? "Selecione o Estado primeiro" : "Selecione a Cidade"} />
                    </SelectTrigger>
                    <SelectContent>
                        {availableCities.map((c) => (
                            <SelectItem key={`${c.name}-${c.latitude}`} value={c.name}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default LocationSelector;
