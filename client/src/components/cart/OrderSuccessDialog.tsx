import { Dialog, DialogContent, Box, Typography, Button } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Link } from "react-router-dom";

interface OrderSuccessDialogProps {
    open: boolean;
    orderNumber: string;
}

const OrderSuccessDialog = ({ open, orderNumber }: OrderSuccessDialogProps) => {
    return (
        <Dialog
            open={open}
            maxWidth={false}
            sx={{ "& .MuiDialog-paper": { width: 420, textAlign: "center" } }}
        >
            <DialogContent sx={{ py: 5, px: 4 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 64, color: "#2e7d32", mb: 2 }} />

                <Typography sx={{ fontSize: 22, fontWeight: 600, mb: 1 }}>
                    Order Placed Successfully!
                </Typography>

                <Typography sx={{ fontSize: 14, color: "#666", mb: 1 }}>
                    Thank you for your purchase
                </Typography>

                <Typography sx={{ fontSize: 15, fontWeight: 500, mb: 3 }}>
                    Order #{orderNumber}
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Button
                        component={Link}
                        to="/account"
                        variant="contained"
                        sx={{
                            backgroundColor: "#c8a951",
                            fontSize: 13,
                            letterSpacing: 1,
                            textDecoration: "none",
                            "&:hover": { backgroundColor: "#b89841" },
                        }}
                    >
                        VIEW MY ORDERS
                    </Button>

                    <Button
                        component={Link}
                        to="/"
                        variant="outlined"
                        sx={{
                            borderColor: "#ddd",
                            color: "#666",
                            fontSize: 13,
                            letterSpacing: 1,
                            textDecoration: "none",
                            "&:hover": { borderColor: "#999" },
                        }}
                    >
                        CONTINUE SHOPPING
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default OrderSuccessDialog;
