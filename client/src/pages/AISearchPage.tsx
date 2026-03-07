import AIStyleSection from "../components/home/AIStyleSection";
import SearchResults from "../components/home/SearchResults";
import useAISearch from "../hooks/useAISearch";

const AISearchPage = () => {
    const { query, setQuery, results, isLoading, hasSearched, error, search, clearResults } = useAISearch();

    return (
        <>
            <AIStyleSection
                query={query}
                onQueryChange={setQuery}
                onSearch={search}
                isLoading={isLoading}
                hasSearched={hasSearched}
            />
            {hasSearched && (
                <SearchResults
                    results={results}
                    isLoading={isLoading}
                    query={query}
                    onClear={clearResults}
                    error={error}
                />
            )}
        </>
    );
};

export default AISearchPage;
