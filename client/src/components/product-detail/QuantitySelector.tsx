import { Box, IconButton, Typography } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

interface QuantitySelectorProps {
    quantity: number;
    stock: number;
    onIncrement: () => void;
    onDecrement: () => void;
}

const QuantitySelector = ({ quantity, stock, onIncrement, onDecrement }: QuantitySelectorProps) => {
    return (
        <Box>
            <Typography
                sx={{
                    fontSize: 12,
                    letterSpacing: 1.5,
                    color: "#999",
                    mb: 1.5,
                }}
            >
                QUANTITY
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: 1 }}>
                    <IconButton
                        onClick={onDecrement}
                        disabled={quantity <= 1}
                        sx={{ width: 40, height: 40, borderRadius: 0 }}
                    >
                        <RemoveIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <Typography
                        sx={{
                            width: 40,
                            textAlign: "center",
                            fontSize: 14,
                            fontWeight: 500,
                        }}
                    >
                        {quantity}
                    </Typography>
                    <IconButton
                        onClick={onIncrement}
                        disabled={quantity >= stock}
                        sx={{ width: 40, height: 40, borderRadius: 0 }}
                    >
                        <AddIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Box>
                { stock < 9 && (
                    <Typography sx={{ fontSize: 13, color: "rgb(204, 58, 0)" }}>
                        Only {stock} left
                    </Typography>   
                )}
            </Box>
        </Box>
    );
};

export default QuantitySelector;
