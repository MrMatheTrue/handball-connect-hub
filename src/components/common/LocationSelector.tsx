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
    // Get all countries from the global database
    const countries = useMemo(() => Country.getAllCountries(), []);

    // Find the current country object by ISO code or name
    const currentCountryObj = useMemo(() => {
        if (!country) return null;

        // Try to find by ISO code first
        let found = countries.find(c => c.isoCode === country);
        if (found) return found;

        // Try to find by name (case insensitive)
        found = countries.find(c => c.name.toLowerCase() === country.toLowerCase());
        return found || null;
    }, [country, countries]);

    const countryCode = currentCountryObj?.isoCode || "";

    // Get states for the selected country
    const availableStates = useMemo(() => {
        if (!countryCode) return [];
        return State.getStatesOfCountry(countryCode);
    }, [countryCode]);

    // Find the current state object
    const currentStateObj = useMemo(() => {
        if (!state || !countryCode) return null;
        return availableStates.find(s =>
            s.isoCode === state ||
            s.name.toLowerCase() === state.toLowerCase()
        );
    }, [state, availableStates, countryCode]);

    const stateCode = currentStateObj?.isoCode || "";

    // Get cities for the selected country and state
    const availableCities = useMemo(() => {
        if (!countryCode || !stateCode) return [];
        return City.getCitiesOfState(countryCode, stateCode);
    }, [countryCode, stateCode]);

    // Handle country selection
    const handleCountryChange = (isoCode: string) => {
        const selectedCountry = countries.find(c => c.isoCode === isoCode);
        if (selectedCountry) {
            onCountryChange(selectedCountry.name);
            onStateChange("");
            onCityChange("");
        }
    };

    // Handle state selection
    const handleStateChange = (isoCode: string) => {
        const selectedState = availableStates.find(s => s.isoCode === isoCode);
        if (selectedState) {
            onStateChange(selectedState.name);
            onCityChange("");
        }
    };

    // Handle city selection
    const handleCityChange = (cityName: string) => {
        onCityChange(cityName);
    };

    return (
        <div className={`w-full ${className}`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Country Select */}
                <div className="space-y-2">
                    <Label>{countryLabel} *</Label>
                    <Select value={countryCode} onValueChange={handleCountryChange}>
                        <SelectTrigger className="bg-secondary border-border">
                            <SelectValue placeholder="Selecione o país" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {countries.map((c) => (
                                <SelectItem key={c.isoCode} value={c.isoCode}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* State Select */}
                <div className="space-y-2">
                    <Label>{stateLabel} *</Label>
                    <Select
                        value={stateCode}
                        onValueChange={handleStateChange}
                        disabled={!countryCode || availableStates.length === 0}
                    >
                        <SelectTrigger className="bg-secondary border-border disabled:opacity-50 disabled:cursor-not-allowed">
                            <SelectValue
                                placeholder={
                                    !countryCode
                                        ? "Selecione o país primeiro"
                                        : availableStates.length === 0
                                            ? "Sem estados disponíveis"
                                            : "Selecione o estado"
                                }
                            />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {availableStates.map((s) => (
                                <SelectItem key={s.isoCode} value={s.isoCode}>
                                    {s.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* City Select */}
                <div className="space-y-2">
                    <Label>{cityLabel} *</Label>
                    <Select
                        value={city}
                        onValueChange={handleCityChange}
                        disabled={!stateCode || availableCities.length === 0}
                    >
                        <SelectTrigger className="bg-secondary border-border disabled:opacity-50 disabled:cursor-not-allowed">
                            <SelectValue
                                placeholder={
                                    !stateCode
                                        ? "Selecione o estado primeiro"
                                        : availableCities.length === 0
                                            ? "Sem cidades disponíveis"
                                            : "Selecione a cidade"
                                }
                            />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {availableCities.map((c) => (
                                <SelectItem key={c.name} value={c.name}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

export default LocationSelector;
