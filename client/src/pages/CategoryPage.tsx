import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Grid, Button, CircularProgress, Snackbar } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import ProductCard from "../components/products/ProductCard";
import FiltersDialog from "../components/products/FiltersDialog";
import { getProductTags } from "../services/products-api";
import useCategoryFilters from "../hooks/useCategoryFilters";
import useCategoryProducts from "../hooks/useCategoryProducts";
import useWishlist from "../hooks/useWishlist";
import { getImageUrl } from "../utils/format";

const categoryConfig: Record<string, { title: string; subtitle: string }> = {
    women: { title: "Women's Collection", subtitle: "Timeless pieces designed for the modern woman" },
    men: { title: "Men's Collection", subtitle: "Modern essentials for the contemporary man" },
    accessories: { title: "Accessories Collection", subtitle: "Complete your look with curated accessories" },
};

const CategoryPage = () => {
    const { category } = useParams<{ category: string }>();
    const config = categoryConfig[category || ""] || categoryConfig.women;

    const [filtersOpen, setFiltersOpen] = useState(false);
    const { currentFilters, updateFilters } = useCategoryFilters(category || "");
    const { products, totalProducts, loading, sentinelRef } = useCategoryProducts(category || "", currentFilters);
    const { isInWishlist, toggleWishlist, snackMessage, closeSnack } = useWishlist();

    return (
        <Box sx={{ minHeight: "80vh" }}>
            {/* Breadcrumb */}
            <Box sx={{ backgroundColor: "#f5f5f5", py: 1.5 }}>
                <Box sx={{ maxWidth: "1280px", mx: "auto", px: { xs: 2, md: 4 }, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", gap: 1, fontSize: 13 }}>
                        <Link to="/" style={{ textDecoration: "none", color: "#999" }}>Home</Link>
                        <Typography sx={{ color: "#999", fontSize: 13 }}>/</Typography>
                        <Typography sx={{ color: "#c8a951", fontSize: 13, fontWeight: 500 }}>
                            {category ? category.charAt(0).toUpperCase() + category.slice(1) : ""}
                        </Typography>
                    </Box>
                    <Typography sx={{ color: "#c8a951", fontSize: 13 }}>
                        Showing {products.length} of {totalProducts}
                    </Typography>
                </Box>
            </Box>

            {/* Title */}
            <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", mb: 1 }}>
                    {config.title}
                </Typography>
                <Typography sx={{ color: "#999", fontSize: 15 }}>
                    {config.subtitle}
                </Typography>
            </Box>

            {/* Filters Button + Product Grid */}
            <Box sx={{ maxWidth: "1280px", mx: "auto", px: { xs: 2, md: 4 }, pb: 8 }}>
                {/* Filters Button */}
                <Button
                    variant="outlined"
                    startIcon={<TuneIcon />}
                    onClick={() => setFiltersOpen(true)}
                    sx={{
                        mb: 4,
                        color: "#000",
                        borderColor: "#ddd",
                        textTransform: "none",
                        fontSize: 13,
                        fontWeight: 500,
                        "&:hover": { borderColor: "#c8a951" },
                    }}
                >
                    Filters & Sort
                </Button>

                {/* Filters Dialog */}
                <FiltersDialog
                    open={filtersOpen}
                    onClose={() => setFiltersOpen(false)}
                    filters={currentFilters}
                    onUpdateFilters={updateFilters}
                />

                {/* Product Grid */}
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product._id}>
                            <ProductCard 
                                id={product._id}
                                name={product.name}
                                type={product.type}
                                price={product.salePrice || product.price}
                                oldPrice={product.salePrice ? product.price : undefined}
                                image={getImageUrl(product.images[0])}
                                tags={getProductTags(product)}
                                category={product.category}  
                                isInWishlist={isInWishlist(product._id)}
                                onWishlistToggle={() => toggleWishlist(product._id)}  
                            />
                        </Grid>
                    ))}
                </Grid>

                {/* Sentinel for infinite scroll */}
                <div ref={sentinelRef} style={{ height: 1 }} />

                {/* No products message */}
                {!loading && products.length === 0 && (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                        <Typography variant="h6" sx={{ color: "#999", mb: 1 }}>
                            No products available at the moment
                        </Typography>
                        <Typography sx={{ color: "#999", fontSize: 14 }}>
                            Please check back later
                        </Typography>
                    </Box>
                )}

                {/* Full page loading overlay - when switching categories */}
                {loading && products.length === 0 && (
                    <Box sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        backdropFilter: "blur(4px)",
                        zIndex: 1000,
                    }}>
                        <CircularProgress sx={{ color: "#c8a951" }} />
                    </Box>
                )}

                {/* Bottom spinner - when loading more via scroll */}
                {loading && products.length > 0 && (
                    <Box sx={{ textAlign: "center", mt: 4 }}>
                        <CircularProgress sx={{ color: "#c8a951" }} />
                    </Box>
                )}
            </Box>
            <Snackbar
                open={snackMessage !== ""}
                autoHideDuration={3000}
                onClose={closeSnack}
                message={snackMessage}
            />
        </Box>
    );
};

export default CategoryPage;
