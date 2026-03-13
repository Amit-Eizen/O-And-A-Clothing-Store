import { useState, useMemo } from "react";

export interface CategoryFilters {
    sortBy: string;
    priceRange: number[];
    selectedSizes: string[];
    selectedColors: string[];
    selectedTypes: string[];
}

const useCategoryFilters = (category: string) => {
    const [filtersState, setFiltersState] = useState<Record<string, CategoryFilters>>({});

    const defaultFilters = useMemo(() => ({
        sortBy: "featured",
        priceRange: [0, 1000],
        selectedSizes: [] as string[],
        selectedColors: [] as string[],
        selectedTypes: [] as string[],
    }), []);
    
    const currentFilters = filtersState[category] || defaultFilters;

    const updateFilters = (newFilters: CategoryFilters) => {
        setFiltersState((prev) => ({ ...prev, [category]: newFilters }));
    };

    return { currentFilters, updateFilters };
};

export default useCategoryFilters;