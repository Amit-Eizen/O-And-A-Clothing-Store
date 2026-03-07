import { Box, Typography, Rating, Button, LinearProgress, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface ProductSidebarProps {
    image: string;
    name: string;
    type: string;
    rating: number;
    price: number;
    reviewBreakdown: { stars: number; percentage: number }[];
    backLink: string;
}

const ProductSidebar = ({ image, name, type, rating, price, reviewBreakdown, backLink }: ProductSidebarProps) => {
    return (
        <Box sx={{ position: "sticky", top: 24 }}>
            {/* Back to Product */}
            <Link to={backLink} style={{ textDecoration: "none", color: "#000", display: "flex", alignItems: "center", gap: 4, marginBottom: 20 }}>
                <ArrowBackIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Back to Product</Typography>
            </Link>

            {/* Prouct Card */}
            <Box sx={{ border: "1px solid #eee", borderRadius: 1, p: 2 }}>
                {/* Image */}
                <Box
                    component="img"
                    src={image}
                    alt={name}
                    sx={{ width: "100%", height: 250, objectFit: "cover", borderRadius: 1, mb: 2 }}
                />

                {/* Type */}
                <Typography sx={{ fontSize: 11, letterSpacing: 1.5, color: "#999", mb: 0.5 }}>
                    {type}
                </Typography>

                {/* Name */}
                <Typography sx={{ fontSize: 16, fontWeight: 600, fontFamily: "Playfair Display, serif", mb: 1 }}>
                    {name}
                </Typography>

                {/* Rating */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Rating value={rating} precision={0.5} readOnly size="small" sx={{ color: "#c8a951" }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                        {rating} 
                    </Typography>
                </Box>

                {/* Price */}
                <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 2 }}>
                    ${price}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                {/* Rating Breakdown */}
                <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>
                    Rating Breakdown
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
                    {reviewBreakdown.map((row) => (
                        <Box key={row.stars} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography sx={{ fontSize: 12, color: "#666", minWidth: 20 }}>
                                {row.stars}
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={row.percentage}
                                sx={{
                                    flex: 1,
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: "#eee",
                                    "& .MuiLinearProgress-bar": {
                                        backgroundColor: "#c8a951",
                                        borderRadius: 3,
                                    },
                                }}
                            />
                            <Typography sx={{ fontSize: 12, color: "#999", minWidth: 30 }}>
                                {row.percentage}%
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* Add to Cart Button */}
                <Button
                    fullWidth
                    variant="contained"
                    sx={{
                        color: "#000",
                        borderColor: "#000",
                        fontWeight: 600,
                        fontSize: 13,
                        letterSpacing: 1,
                        py: 1.5,
                        "&:hover": { backgroundColor: "#000", color: "#fff" },
                    }}
                >
                    Add to Cart
                </Button>
            </Box>
        </Box>
    );
};

export default ProductSidebar;