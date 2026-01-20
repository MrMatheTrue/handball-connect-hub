import React, { useEffect, useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Country, State, City } from "country-state-city";

interface LocationSelectorProps {
    country: string; // ISO code or Name (internally we'll try to handle both for compatibility)
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
    // Memoized list of all countries
    const countries = useMemo(() => Country.getAllCountries(), []);

    // Find the current country object to get its ISO code
    const currentCountryObj = useMemo(() => {
        if (!country) return null;
        return countries.find(c => c.isoCode === country || c.name === country);
    }, [country, countries]);

    const countryCode = currentCountryObj?.isoCode || "";

    // Get available states based on selected country
    const availableStates = useMemo(() => {
        if (!countryCode) return [];
        return State.getStatesOfCountry(countryCode);
    }, [countryCode]);

    // Find the current state object
    const currentStateObj = useMemo(() => {
        if (!state || !countryCode) return null;
        return availableStates.find(s => s.isoCode === state || s.name === state);
    }, [state, availableStates, countryCode]);

    const stateCode = currentStateObj?.isoCode || "";

    // Get available cities based on selected country and state
    const availableCities = useMemo(() => {
        if (!countryCode || !stateCode) return [];
        return City.getCitiesOfState(countryCode, stateCode);
    }, [countryCode, stateCode]);

    // Update handlers to pass the data we need (Name for the form)
    const handleCountryChange = (val: string) => {
        const found = countries.find(c => c.isoCode === val);
        if (found) {
            onCountryChange(found.name);
            onStateChange("");
            onCityChange("");
        }
    };

    const handleStateChange = (val: string) => {
        const found = availableStates.find(s => s.isoCode === val);
        if (found) {
            onStateChange(found.name);
            onCityChange("");
        }
    };

    return (
        <div className={`grid sm:grid-cols-3 gap-4 ${className}`}>
            <div className="space-y-2">
                <Label>{countryLabel} *</Label>
                <Select value={countryCode} onValueChange={handleCountryChange}>
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
                    value={stateCode}
                    onValueChange={handleStateChange}
                    disabled={!countryCode || availableStates.length === 0}
                >
                    <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder={!countryCode ? "Aguardando País..." : "Selecione o Estado"} />
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
                    value={city}
                    onValueChange={onCityChange}
                    disabled={!stateCode || availableCities.length === 0}
                >
                    <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder={!stateCode ? "Aguardando Estado..." : "Selecione a Cidade"} />
                    </SelectTrigger>
                    <SelectContent>
                        {availableCities.map((c) => (
                            <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default LocationSelector;
