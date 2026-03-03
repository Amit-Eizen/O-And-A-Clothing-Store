import { Box, Typography, Grid } from "@mui/material";
import ProductCard from "../products/ProductCard";
import { Link } from "react-router-dom";
import product1 from "../../assets/product-1.jpg";
import product2 from "../../assets/product-2.jpg";
import product3 from "../../assets/product-3.jpg";
import product4 from "../../assets/product-4.jpg";

const products = [
    { id: 1, name: "Cashmere Coat", type: "Jacket", price: 489, oldPrice: 650, image: product1, tags: ["NEW", "SALE"], category: "women" },
    { id: 2, name: "Silk Midi Dress", type: "Dress", price: 325, image: product2, tags: ["NEW"], category: "women" },
    { id: 3, name: "Leather Tote", type: "Bag", price: 445, image: product3, tags: ["NEW"], category: "accessories" },
    { id: 4, name: "Chelsea Boots", type: "Shoes", price: 365, image: product4, tags: ["NEW"], category: "women" },
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
                        <ProductCard {...product} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default NewArrivals;