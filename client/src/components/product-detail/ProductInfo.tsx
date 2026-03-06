import { Box, Typography, Rating, Chip, Button, Divider } from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ColorSelector from "./ColorSelector";
import SizeSelector from "./SizeSelector";
import QuantitySelector from "./QuantitySelector";
import TrustBadges from "./TrustBadges";

interface ProductInfoProps {
    product: {
        name: string;
        type: string;
        price: number;
        oldPrice?: number;
        rating: number;
        reviewCount: number;
        colors: { name: string; value: string }[];
        sizes: string[];
        stock: number;
    };
    selectedColor: string;
    onColorChange: (color: string) => void;
    selectedSize: string;
    onSizeChange: (size: string) => void;
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
    savings: number;
    onAddToCart: () => void;
}

const ProductInfo = ({
    product,
    selectedColor,
    onColorChange,
    selectedSize,
    onSizeChange,
    quantity,
    onIncrement,
    onDecrement,
    savings,
    onAddToCart,
}: ProductInfoProps) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Type Label */}
            <Typography
                sx={{
                    fontSize: 11,
                    letterSpacing: 1.5,
                    color: "#999",
                    textTransform: "uppercase",
                }}
            >
                {product.type}
            </Typography>

            {/* Product Name */}
            <Typography
                variant="h4"
                sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    mt: -2,
                }}
            >
                {product.name}
            </Typography>

            {/* Rating */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: -2 }}>
                <Rating value={product.rating} precision={0.5} readOnly sx={{ color: "#c8a951" }} />
                <Typography sx={{ fontSize: 13, color: "#999" }}>
                    ({product.reviewCount} reviews)
                </Typography>
            </Box>

            {/* Price */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography sx={{ fontSize: 28, fontWeight: 700 }}>
                    ${product.price.toFixed(2)}
                </Typography>
                {product.oldPrice && (
                    <Typography
                        sx={{
                            fontSize: 18,
                            color: "#999",
                            textDecoration: "line-through",
                        }}
                    >
                        ${product.oldPrice.toFixed(2)}
                    </Typography>
                )}
                {savings > 0 && (
                    <Chip
                        label={`SAVE $${savings.toFixed(2)}`}
                        size="small"
                        sx={{
                            backgroundColor: "#e8f5e9",
                            color: "#2e7d32",
                            fontWeight: 600,
                            fontSize: 12,
                        }}
                    />
                )}
            </Box>

            {/* Color Selector */}
            <ColorSelector
                colors={product.colors}
                selectedColor={selectedColor}
                onColorChange={onColorChange}
            />

            {/* Size Selector */}
            <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSizeChange={onSizeChange}
            />

            {/* Quantity Selector */}
            <QuantitySelector
                quantity={quantity}
                stock={product.stock}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
            />

            {/* Add to Cart Button */}
            <Button
                variant="contained"
                fullWidth
                onClick={onAddToCart}
                sx={{
                    backgroundColor: "#000",
                    color: "#fff",
                    py: 1.5,
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: 1,
                    "&:hover": { backgroundColor: "#333" },
                }}
            >
                Add to Cart - ${(product.price * quantity).toFixed(2)}
            </Button>

            {/* Wishlist Button */}
            <Button
                variant="outlined"
                fullWidth
                startIcon={<FavoriteBorderOutlinedIcon />}
                sx={{
                    borderColor: "#c8a951",
                    color: "#c8a951",
                    py: 1.2,
                    fontSize: 13,
                    letterSpacing: 1,
                    "&:hover": {
                        borderColor: "#b8993e",
                        backgroundColor: "rgba(200, 169, 81, 0.04)",
                    },
                }}
            >
                Add to Wishlist
            </Button>

            <Divider />

            {/* Trust Badges */}
            <TrustBadges />
        </Box>
    );
};

export default ProductInfo;
