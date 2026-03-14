import { Box, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CartItem from "../components/cart/CartItem";
import OrderSummary from "../components/cart/OrderSummary";
import CheckoutDialog from "../components/cart/CheckoutDialog";
import OrderSuccessDialog from "../components/cart/OrderSuccessDialog";
import useCart from "../hooks/useCart";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
    const { cartItems, updateItemQuantity, removeItem, clearCart,
        subtotal, shipping, tax, total } = useCart();
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [successOrderNumber, setSuccessOrderNumber] = useState("");
    const navigate = useNavigate();

    return (
        <Box>
            {/* Breadcrumb */}
            <Box sx={{ backgroundColor: "#f5f5f5", py: 1.5 }}>
                <Box sx={{ maxWidth: "1280px", mx: "auto", px: { xs: 2, md: 4 }, display: "flex", gap: 1, fontSize: 13 }}>
                    <Link to="/" style={{ textDecoration: "none", color: "#999" }}>Home</Link>
                    <Typography sx={{ color: "#999", fontSize: 13 }}>/</Typography>
                    <Typography sx={{ color: "#c8a951", fontSize: 13, fontWeight: 500 }}>Shopping Cart</Typography>
                </Box>
            </Box>

            {/* Content */}
            <Box sx={{ maxWidth: "1280px", mx: "auto", px: { xs: 2, md: 4 }, py: 4 }}>
                <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", mb: 4 }}>
                    Shopping Cart
                </Typography>

                <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", md: "row" } }}>
                    <Box sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 3 }}>
                        {cartItems.map((item) => (
                            <CartItem 
                                key={`${item.productId}-${item.size}-${item.color}`} 
                                {...item} 
                                onUpdateQuantity={updateItemQuantity} 
                                onRemove={removeItem} 
                            />
                        ))}

                        <Box onClick={() => navigate(-1)} style={{ textDecoration: "none", color: "#000", display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
                            <ArrowBackIcon sx={{ fontSize: 18 }} />
                            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Continue Shopping</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <OrderSummary 
                            subtotal={subtotal} 
                            shipping={shipping} 
                            tax={tax} 
                            total={total} 
                            onCheckout={() => setCheckoutOpen(true)} 
                            isEmpty={cartItems.length === 0} />
                    </Box>
                </Box>
            </Box>

            <CheckoutDialog 
                open={checkoutOpen} 
                onClose={() => setCheckoutOpen(false)} 
                onSuccess={(orderNumber: string) => {
                    clearCart();
                    setSuccessOrderNumber(orderNumber);
                }}
                subtotal={subtotal} 
                shipping={shipping} 
                tax={tax} 
                total={total} />

            <OrderSuccessDialog
                open={successOrderNumber !== ""}
                orderNumber={successOrderNumber}
            />
        </Box>
    );
};

export default CartPage;
