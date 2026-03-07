import { Box, Typography, Grid, Button, CircularProgress, Divider } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ProductCard from "../products/ProductCard";

interface SearchResultsProps {
    results: any[];
    isLoading: boolean;
    query: string;
    onClear: () => void;
    error: string | null;
}

const SearchResults = ({ results, isLoading, query, onClear, error }: SearchResultsProps) => {
    return (
        <Box sx={{ maxWidth: "1280px", mx: "auto", px: { xs: 2, md: 4 }, py: 6 }}>
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <AutoAwesomeIcon sx={{ color: "#c8a951", fontSize: 28 }} />
                <Typography
                    variant="h4"
                    sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                >
                    Results for "{query}"
                </Typography>
            </Box>
            <Typography sx={{ color: "#c8a951", fontSize: 14, mb: 4 }}>
                Showing {results.length} of {results.length} products
            </Typography>

            {/* Loading */}
            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                    <CircularProgress sx={{ color: "#c8a951" }} />
                </Box>
            )}

            {/* Error */}
            {error && (
                <Typography sx={{ color: "red", textAlign: "center", py: 4 }}>
                    {error}
                </Typography>
            )}

            {/* Product Grid */}
            {!isLoading && !error && results.length > 0 && (
                <Grid container spacing={3}>
                    {results.map((product) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                            <ProductCard 
                                id={product.id}
                                name={product.name}
                                type={product.type}
                                price={product.price}
                                oldPrice={product.salePrice}
                                image={product.images?.[0] || ""}
                                tags={product.tags || []}
                                category={product.category}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Load More Button */}
            {!isLoading && !error && (
                <Box sx={{ textAlign: "center", mt: 6 }}>
                    <Button
                        variant="outlined"
                        sx={{
                            px: 6,
                            py: 1.5,
                            color: "#000",
                            borderColor: "#000",
                            fontWeight: 600,
                            fontSize: 13,
                            letterSpacing: 1,
                            "&:hover": { backgroundColor: "#000", color: "#fff" },
                        }}
                    >
                        LOAD MORE PRODUCTS
                    </Button>
                </Box>
            )}

            {/* No Results */}
            {!isLoading && !error && results.length === 0 && (
                <>
                    <Divider sx={{ my: 6 }} />
                    <Box sx={{ textAlign: "center", py: 4 }}>
                        <Typography sx={{ color: "#999", fontSize: 15, mb: 3 }}>
                            Didn't find what you're looking for?
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={onClear}
                            sx={{
                                backgroundColor: "#c8a951",
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: 13,
                                letterSpacing: 1,
                                px: 4,
                                py: 1.5,
                                "&:hover": { backgroundColor: "#b8993e" },
                            }}
                        >
                            TRY ANOTHER SEARCH
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default SearchResults;