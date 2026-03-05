import { Box, Typography, TextField, Button, Divider } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";

interface OrderSummaryProps {
    subtotal: number;
    shipping: number; 
    tax: number;
    total: number;
    onCheckout: () => void;
    isEmpty: boolean;
}

const OrderSummary = ({ subtotal, shipping, tax, total, onCheckout, isEmpty }: OrderSummaryProps) => {
    return (
        <Box sx={{ border: "1px solid #eee", borderRadius: 1, p: 4 }}>
            { /* Title */ }
            <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", mb: 3 }}>
                Order Summary
            </Typography>

            { /* Promo Code */ }
            <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                <TextField
                    placeholder="Promo code"
                    size="small"
                    fullWidth
                    sx={{ "& .MuiInputBase-input": { fontSize: 13 } }}
                />
                <Button
                    variant="contained"
                    sx={{
                        color: "#000",
                        borderColor: "#000",
                        fontWeight: 600,
                        fontSize: 12,
                        px: 3,
                        whiteSpace: "nowrap",
                        "&:hover": { backgroundColor: "#000", color: "#fff" },
                    }}
                >
                    Apply
                </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            { /* Price Breakdown */ }
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography sx={{ fontSize: 14, color: "#666" }}>Subtotal</Typography>
                <Typography sx={{ fontSize: 14, color: "#000" }}>${subtotal.toFixed(2)}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography sx={{ fontSize: 14, color: "#666" }}>Shipping</Typography>
                <Typography sx={{ fontSize: 14, color: shipping === 0 ? "#2e7d32" : undefined }}>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography sx={{ fontSize: 14, color: "#666" }}>Tax (8%)</Typography>
                <Typography sx={{ fontSize: 14 }}>${tax.toFixed(2)}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            { /* Total */ }
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600 }}>Total</Typography>
                <Typography sx={{ fontSize: 22, fontWeight: 700 }}>${total.toFixed(2)}</Typography>
            </Box>

            { /* Checkout Button */ }
            <Button
                variant="contained"
                fullWidth
                endIcon={<ArrowForwardIcon />}
                onClick = {onCheckout}
                disabled={isEmpty}
                sx={{
                    backgroundColor: "#000",
                    color: "#fff",
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: 13,
                    letterSpacing: 1,
                    "&:hover": { backgroundColor: "#333" },
                }}
            >
                PROCEED TO CHECKOUT
            </Button>

            {/* Trust Badges */}
            <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocalShippingOutlinedIcon sx={{ fontSize: 18, color: "#2e7d32" }} />
                    <Typography sx={{ fontSize: 12, color: "#2e7d32" }}>You qualify for free shipping!</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LockOutlinedIcon sx={{ fontSize: 18, color: "#999" }} />
                    <Typography sx={{ fontSize: 12, color: "#666" }}>Secure checkout</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ReplayOutlinedIcon sx={{ fontSize: 18, color: "#999" }} />
                    <Typography sx={{ fontSize: 12, color: "#666" }}>30-day return policy</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default OrderSummary;