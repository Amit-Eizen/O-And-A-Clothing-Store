import { Box, Typography } from "@mui/material";

interface ShippingTabProps {
    shippingInfo: string;
    returnsInfo: string;
}

const ShippingTab = ({ shippingInfo, returnsInfo }: ShippingTabProps) => {
    return (
        <Box
            sx={{
                py: 3,
                display: "flex",
                gap: 6,
                flexDirection: { xs: "column", md: "row" },
            }}
        >
            {/* Shipping Information */}
            <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1.5 }}>
                    Shipping Information
                </Typography>
                <Typography sx={{ fontSize: 14, color: "#666", lineHeight: 1.8 }}>
                    {shippingInfo}
                </Typography>
            </Box>

            {/* Returns & Exchanges */}
            <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1.5 }}>
                    Returns & Exchanges
                </Typography>
                <Typography sx={{ fontSize: 14, color: "#666", lineHeight: 1.8 }}>
                    {returnsInfo}
                </Typography>
            </Box>
        </Box>
    );
};

export default ShippingTab;
