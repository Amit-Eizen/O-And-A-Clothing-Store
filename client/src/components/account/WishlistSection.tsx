import { useEffect, useState } from "react";
import { Box, Typography, Grid, Button, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import apiClient from "../../services/api-client";

interface WishlistProduct {
    _id: string;
    name: string;
    type: string;
    price: number;
    salePrice?: number;
    images: string[];
    category: string;
    tags: string[];
}

const WishlistSection = () => {
    const [products, setProducts] = useState<WishlistProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get("/wishlist")
            .then((res) => setProducts(res.data.products || []))
            .catch((err) => console.error("Failed to fetch wishlist:", err))
            .finally(() => setLoading(false));
    }, []);

    const handleRemove = async (productId: string) => {
        try {
            await apiClient.delete(`/wishlist/${productId}`);
            setProducts(products.filter((p) => p._id !== productId));
        } catch (err) {
            console.error("Failed to remove from wishlist:", err);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;

    if (products.length === 0) {
        return (
            <Box>
                <Typography variant="h5" sx={{ mb: 1.5, fontFamily: "'Playfair Display', serif", fontSize: "1.75rem" }}>
                    My Wishlist
                </Typography>
                <Typography color="text.secondary">
                    Your wishlist is empty.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem" }}>
                    My Wishlist
                </Typography>
                <Typography sx={{ mb: 3 }} color="text.secondary">
                    {products.length} items
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
                        <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 2, overflow: "hidden", position: "relative" }}>
                            {/* Heart Remove Button */}
                            <IconButton
                                onClick={() => handleRemove(product._id)}
                                sx={{ position: "absolute", top: 8, right: 8, zIndex: 1, backgroundColor: "rgba(255,255,255,0.8)", "&:hover": { backgroundColor: "rgba(255,255,255,1)" } }}
                            >
                                <FavoriteIcon sx={{ color: "#e53935" }} />
                            </IconButton>

                            {/* Product Image */}
                            <Box
                                component="img"
                                src={`${apiClient.defaults.baseURL}${product.images?.[0]}`}
                                sx={{ width: "100%", height: 250, objectFit: "cover", cursor: "pointer" }}
                                onClick={() => window.location.href = `/${product.category}/${product._id}`}
                            />

                            {/* Product Info */}
                            <Box sx={{ p: 2 }}>
                                <Typography variant="body2" color="text.secondary">{product.type}</Typography>
                                <Typography fontWeight="bold">{product.name}</Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                    {product.salePrice ? (
                                        <>
                                            <Typography fontWeight="bold" sx={{ color: "#e53935" }}>
                                                {"$"}{product.salePrice.toFixed(2)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ textDecoration: "line-through", color: "#999" }}>
                                                {"$"}{product.price.toFixed(2)}
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography fontWeight="bold">
                                            {"$"}{product.price.toFixed(2)}
                                        </Typography>
                                    )}
                                </Box>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 2, color: "#000", borderColor: "#000", fontWeight: 600, fontSize: 12, "&:hover": { backgroundColor: "#000", color: "#fff" } }}
                                    onClick={() => window.location.href = `/${product.category}/${product._id}`}
                                >
                                    VIEW PRODUCT
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default WishlistSection;