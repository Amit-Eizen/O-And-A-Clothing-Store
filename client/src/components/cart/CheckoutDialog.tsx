import { Dialog, DialogTitle, DialogContent, DialogActions,
        Box, Typography, Button, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import useCheckoutForm from "../../hooks/useCheckoutForm";
import FormField from "./FormField";

interface CheckoutDialogProps {
    open: boolean;
    onClose: () => void;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}

const CheckoutDialog = ({ open, onClose, subtotal, shipping, tax, total }: CheckoutDialogProps) => {
    const { form, errors, handleChange, handleSubmit, handleClose } = useCheckoutForm();

    return (
        <Dialog
            open={open}
            onClose={() => handleClose(onClose)}
            maxWidth={false}
            fullWidth={false}
            sx={{ "& .MuiDialog-paper": { width: 500, maxHeight: "90vh" }, "& .MuiBackdrop-root": { backgroundColor: "rgba(0,0,0,0.5)" } }}
        >
            {/* Header */}
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif" }}>
                    Checkout
                </Typography>
                <IconButton onClick={() => handleClose(onClose)}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {/* Payment info */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <CreditCardOutlinedIcon sx={{ fontSize: 20, color: "#c8a951" }} />
                    <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Payment Information</Typography>
                </Box>

                <FormField
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    value={form.cardNumber}
                    error={errors.cardNumber}
                    onChange={handleChange("cardNumber")} 
                />

                <FormField
                    label="Cardholder Name"
                    placeholder="John Doe"
                    value={form.cardholderName}
                    error={errors.cardholderName}
                    onChange={handleChange("cardholderName")} 
                />

                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Box sx={{ flex: 1 }}>
                        <FormField
                            label="Expiration Date"
                            placeholder="MM/YY"
                            value={form.expirationDate}
                            error={errors.expirationDate}
                            onChange={handleChange("expirationDate")}
                            mb={0} 
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <FormField
                            label="CVV"
                            placeholder="123"
                            value={form.cvv}
                            error={errors.cvv}
                            onChange={handleChange("cvv")}
                            mb={0} 
                        />
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Shipping info */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <LocationOnOutlinedIcon sx={{ fontSize: 20, color: "#c8a951" }} />
                    <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Shipping Information</Typography>
                </Box>

                <FormField
                    label="Street Address"
                    placeholder="123 Main St, Apt 4B"
                    value={form.streetAddress}
                    error={errors.streetAddress}
                    onChange={handleChange("streetAddress")} 
                    mb={1}
                />
                <FormField
                    label="City"
                    placeholder="New York"
                    value={form.city}
                    error={errors.city}
                    onChange={handleChange("city")}
                    mb={0}
                />

                <Box sx={{ display: "flex", gap: 2, mb: 3, mt: 1 }}>
                    <Box sx={{ flex: 1 }}>
                        <FormField
                            label="ZIP Code"
                            placeholder="10001"
                            value={form.zipCode}
                            error={errors.zipCode}
                            onChange={handleChange("zipCode")}
                            mb={0}
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <FormField
                            label="Country"
                            placeholder="USA"
                            value={form.country}
                            error={errors.country}
                            onChange={handleChange("country")}
                            mb={0}
                        />
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Contact info */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <PhoneOutlinedIcon sx={{ fontSize: 20, color: "#c8a951" }} />
                    <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Contact Information</Typography>
                </Box>

                <FormField
                    label="Phone Number"
                    placeholder="+972 50-123-4567"
                    value={form.phoneNumber}
                    error={errors.phoneNumber}
                    onChange={handleChange("phoneNumber")} 
                />

                <FormField
                    label="Email"
                    placeholder="john.doe@example.com"
                    value={form.email}
                    error={errors.email}
                    onChange={handleChange("email")}
                />

                <Divider sx={{ my: 2 }} />

                {/* Order Summary */}
                <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 2 }}>
                    Order Summary
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography sx={{ fontSize: 13, color: "#666" }}>Subtotal</Typography>
                    <Typography sx={{ fontSize: 13, color: "#000" }}>${subtotal.toFixed(2)}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography sx={{ fontSize: 13, color: "#666" }}>Shipping</Typography>
                    <Typography sx={{ fontSize: 13, color: shipping === 0 ? "#2e7d32" : undefined }}>
                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography sx={{ fontSize: 13, color: "#666" }}>Tax (8%)</Typography>
                    <Typography sx={{ fontSize: 13 }}>${tax.toFixed(2)}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography sx={{ fontSize: 15, fontWeight: 600 }}>Total</Typography>
                    <Typography sx={{ fontSize: 18, fontWeight: 700 }}>${total.toFixed(2)}</Typography>
                </Box>
            </DialogContent>

            {/* Footer Buttons */}
            <DialogActions sx={{ px: 3, py: 2, gap: 2 }}>
                <Button
                    variant="outlined"
                    onClick={() => handleSubmit(onClose)}
                    sx={{
                        flex: 2,
                        backgroundColor: "#c8a951",
                        color: "#fff",
                        fontWeight: 500,
                        fontSize: 12,
                        letterSpacing: 1,
                        px: 1.5,
                        "&:hover": { backgroundColor: "#b89841" },
                    }}
                >
                    Place Order
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => handleClose(onClose)}
                    sx={{
                        flex: 1,
                        color: "#666",
                        borderColor: "#ddd",
                        fontWeight: 500,
                        fontSize: 12,
                        py: 1.5,
                        "&:hover": { borderColor: "#999" },
                    }}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CheckoutDialog;