import { useState } from "react";
import apiClient from "../services/api-client";

const useAISearch = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
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