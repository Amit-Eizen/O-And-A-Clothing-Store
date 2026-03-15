import { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import ProductCard from "../products/ProductCard";
import { Link } from "react-router-dom";
import { fetchNewArrivals, getProductTags } from "../../services/products-api";
import type { ProductFromServer } from "../../services/products-api";
import { getImageUrl } from "../../utils/format";
import useWishlist from "../../hooks/useWishlist";

const NewArrivals = () => {
    const [products, setProducts] = useState<ProductFromServer[]>([]);
    const { isInWishlist, toggleWishlist } = useWishlist();

    useEffect(() => {
        fetchNewArrivals(4)
            .then((res) => setProducts(res))
            .catch(() => {});
    }, []);

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
        </Box>
    );
};

export default NewArrivals;
