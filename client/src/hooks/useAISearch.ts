import { useState } from "react";
import apiClient from "../services/api-client";

const CACHE_KEY = "ai-search-cache";

interface SearchCache {
    query: string;
    results: any[];
}

const loadCache = (): SearchCache | null => {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    try {
        return JSON.parse(cached);
    } catch {
        return null;
    }
};

const saveCache = (query: string, results: any[]) => {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ query, results }));
};

const clearCache = () => {
    sessionStorage.removeItem(CACHE_KEY);
};

const useAISearch = () => {
    const cached = loadCache();
    const [query, setQuery] = useState(cached?.query || "");
    const [results, setResults] = useState<any[]>(cached?.results || []);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(!!cached);
    const [error, setError] = useState<string | null>(null);

    const search = async (searchQuery: string) => {
        if (!searchQuery.trim())
            return;

        setIsLoading(true);
        setError(null);
        setHasSearched(true);
        try {
            const response = await apiClient.get("/products/smart-search", {
                params: { q: searchQuery }
            });
            setResults(response.data);
            saveCache(searchQuery, response.data);
        } catch {
            setError("Search failed. Please try again.");
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearResults = () => {
        setResults([]);
        setHasSearched(false);
        setQuery("");
        setError(null);
        clearCache();
    };

    return {
        query,
        setQuery,
        results,
        isLoading,
        hasSearched,
        error,
        search,
        clearResults
    };
};

export default useAISearch;
