import { Box, Typography, Chip } from "@mui/material";
import { Link } from "react-router-dom";

interface ProductCardProps {
    id: number;
    name: string;
    type: string;
    price: number;
    oldPrice?: number;
    image: string;
    tags: string[];
    category: string;
}

const ProductCard = ({ id, name, type, price, oldPrice, image, tags, category }: ProductCardProps) => {
    return (
        <Link to={`/${category}/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
            {/* Image */}
            <Box sx={{ position: "relative", height: 400, overflow: "hidden", mb: 2, borderRadius: 1, "&:hover img": { transform: "scale(1.03)" } }}>
                <Box
                    component="img"
                    src={image}
                    alt={name}
                    sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                />
                {/* Tags */}
                <Box sx={{ position: "absolute", top: 12, left: 12, display: "flex", flexDirection: "column", gap: 1 }}>
                    {tags.map((tag) => (
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

            {/* Info */}
            <Typography sx={{ fontSize: 11, letterSpacing: 1.5, color: "#999", mb: 0.5 }}>
                {type}
            </Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 500, mb: 0.5 }}>
                {name}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography sx={{ fontWeight: 600 }}>${price}</Typography>
                {oldPrice && (
                    <Typography sx={{ color: "#999", textDecoration: "line-through", fontSize: 14 }}>
                        ${oldPrice}
                    </Typography>
                )}
            </Box>
        </Link>
    );
};

export default ProductCard;