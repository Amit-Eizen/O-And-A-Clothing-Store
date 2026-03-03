import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Grid, Button } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import ProductCard from "../components/products/ProductCard";
import FiltersDialog from "../components/products/FiltersDialog";
import product1 from "../assets/product-1.jpg";
import product2 from "../assets/product-2.jpg";
import product3 from "../assets/product-3.jpg";
import product4 from "../assets/product-4.jpg";

const categoryConfig: Record<string, { title: string; subtitle: string }> = {
    women: { title: "Women's Collection", subtitle: "Timeless pieces designed for the modern woman" },
    men: { title: "Men's Collection", subtitle: "Modern essentials for the contemporary man" },
    accessories: { title: "Accessories Collection", subtitle: "Complete your look with curated accessories" },
};

const mockProducts = [
    { id: 1, name: "Silk Midi Dress", type: "Dress", price: 325, image: product1, tags: ["NEW"], category: "women" },
    { id: 2, name: "Cashmere Sweater", type: "Jacket", price: 289, oldPrice: 350, image: product2, tags: ["SALE"], category: "women" },
    { id: 3, name: "Tailored Blazer", type: "Jacket", price: 425, image: product3, tags: ["NEW"], category: "women" },
    { id: 4, name: "Wide Leg Trousers", type: "Pants", price: 195, image: product4, tags: [], category: "women" },
    { id: 5, name: "Linen Shirt", type: "Shirt", price: 175, image: product1, tags: [], category: "women" },
    { id: 6, name: "Wrap Dress", type: "Dress", price: 155, image: product2, tags: ["NEW"], category: "women" },
    { id: 7, name: "Denim Jacket", type: "Jacket", price: 205, image: product3, tags: [], category: "women" },
    { id: 8, name: "High Waist Jeans", type: "Jeans", price: 145, oldPrice: 195, image: product4, tags: ["SALE"], category: "women" },
];

const CategoryPage = () => {
    const { category } = useParams<{ category: string }>();
    const config = categoryConfig[category || ""] || categoryConfig.women;
    const products = mockProducts;

    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filtersState, setFiltersState] = useState<Record<string, {
        sortBy: string;
        priceRange: number[];
        selectedSizes: string[];
        selectedColors: string[];
        selectedTypes: string[];
    }>>({});

    const currentFilters = filtersState[category || ""] || {
        sortBy: "featured",
        priceRange: [0, 1000],
        selectedSizes: [],
        selectedColors: [],
        selectedTypes: [],
    };

    const updateFilters = (filters: typeof currentFilters) => {
        setFiltersState((prev) => ({ ...prev, [category || ""]: filters }));
    };
    
    return (
        <Box>
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
                        Showing {products.length} of {products.length}
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
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                            <ProductCard {...product} />
                        </Grid>
                    ))}
                </Grid>

                {/* Load More */}
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
            </Box>
        </Box>
    );
};

export default CategoryPage;
