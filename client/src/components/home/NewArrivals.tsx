import { Box, Typography, Grid, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import product1 from "../../assets/product-1.jpg";
import product2 from "../../assets/product-2.jpg";
import product3 from "../../assets/product-3.jpg";
import product4 from "../../assets/product-4.jpg";

const products = [
    { id: 1, name: "Cashmere Coat", brand: "LUXE ESSENTIALS", price: 489, oldPrice: 650, image: product1, tags: ["NEW", "SALE"], category: "women" },
    { id: 2, name: "Silk Midi Dress", brand: "ATELIER NOIR", price: 325, image: product2, tags: ["NEW"], category: "women" },
    { id: 3, name: "Leather Tote", brand: "LUXE ESSENTIALS", price: 445, image: product3, tags: ["NEW"], category: "accessories" },
    { id: 4, name: "Chelsea Boots", brand: "ARTISAN", price: 365, image: product4, tags: ["NEW"], category: "women" },
];

const NewArrivals = () => {
    return (
        <Box sx={{ py: 8, maxWidth: "1280px", mx: "auto", px: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 5 }}>
                <Box>
                    <Typography sx={{ fontSize: 13, letterSpacing: 3, color: "#c8a951", mb: 1 }}>
                        JUST ARRIVED
                    </Typography>
                    <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif" }}>
                        New Arrivals
                    </Typography>
                </Box>
                <Link to="/new-arrivals" style={{ textDecoration: "none" }}>
                    <Typography sx={{ fontSize: 13, letterSpacing: 2, color: "#555", fontWeight: 500, "&:hover": { color: "#c8a951" } }}>
                        VIEW ALL &gt;
                    </Typography>
                </Link>
            </Box>

            {/* Product Grid */}
            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                        <Link to={`/${product.category}/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                            {/* Image */}
                            <Box sx={{ position: "relative", height: 400, overflow: "hidden", mb: 2, borderRadius: 1, "&:hover img": { transform: "scale(1.03)" } }}>
                                <Box
                                    component="img"
                                    src={product.image}
                                    alt={product.name}
                                    sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                                />
                                {/* Tags */}
                                <Box sx={{ position: "absolute", top: 12, left: 12, display: "flex", flexDirection: "column", gap: 1 }}>
                                    {product.tags.map((tag) => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            size="small"
                                            sx={{
                                                backgroundColor: tag === "SALE" ? "#c8a951" : "#000",
                                                color: "#fff",
                                                fontWeight: 600,
                                                fontSize: 11,
                                                height: 24,
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                            
                            { /* Info */ }
                            <Typography sx={{ fontSize: 11, letterSpacing: 1.5, color: "#999", mb: 0.5 }}>
                                {product.brand}
                            </Typography>
                            <Typography sx={{ fontSize: 15, fontWeight: 500, mb: 0.5 }}>
                                {product.name}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                <Typography sx={{ fontWeight: 600 }}>${product.price}</Typography>
                                {product.oldPrice && (
                                    <Typography sx={{ color: "#999", textDecoration: "line-through", fontSize: 14 }}>
                                        ${product.oldPrice}
                                    </Typography>
                                )}
                            </Box>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default NewArrivals;