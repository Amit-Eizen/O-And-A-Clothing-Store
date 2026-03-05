import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

interface CartItemProps {
    id: number;
    name: string;
    type: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    image: string;
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
}

const CartItem = ({ id, name, type, size, color, price, quantity, image, onUpdateQuantity, onRemove }: CartItemProps) => {
    return (
        <Box sx={{ display: "flex", gap: 3, p: 3, border: "1px solid #eee", borderRadius: 1, position: "relative" }}>
            {/* Image */}
            <Box
                component="img"
                src={image}
                alt={name}
                sx={{ width: 120, height: 120, objectFit: "cover", borderRadius: 1 }}
            />

            {/* Info */}
             <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Box>
                    <Typography sx={{ fontSize: 11, letterSpacing: 1.5, color: "#999", mb: 0.5 }}>
                        {type}
                    </Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 1 }}>
                        {name}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: "#666" }}>Size: {size}</Typography>
                    <Typography sx={{ fontSize: 13, color: "#666" }}>Color: {color}</Typography>
                </Box>

                { /* Quantity Controls */ }
                <Box sx={{ display: "flex", alignItems: "center", gap: 0, mt: 1 }}>
                    <IconButton
                        size="small"
                        onClick={() => onUpdateQuantity(id, Math.max(1, quantity - 1))}
                        sx={{ border: "1px solid #ddd", borderRadius: 1, width: 32, height: 32 }}
                    >
                        <RemoveIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <Typography sx={{ width: 40, textAlign: "center", fontSize: 14, fontWeight: 500 }}>
                        {quantity}
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={() => onUpdateQuantity(id, quantity + 1)}
                        sx={{ border: "1px solid #ddd", borderRadius: 1, width: 32, height: 32 }}
                    >
                        <AddIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Box>
            </Box>

            {/* Price */}
            <Typography sx={{ fontWeight: 600, fontSize: 16, alignSelf: "flex-end" }}>
                ${price * quantity}
            </Typography>

            {/* Remove Button */}
            <IconButton
                onClick={() => onRemove(id)}
                sx={{ position: "absolute", top: 8, right: 8}}
                size="small"
            >
                <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
        </Box>
    );
}

export default CartItem;