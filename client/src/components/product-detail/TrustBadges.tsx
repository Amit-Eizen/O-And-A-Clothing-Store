import { Box, Typography } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const badges = [
    { icon: <LocalShippingOutlinedIcon />, label: "Free Shipping", sublabel: "Over $200" },
    { icon: <ReplayOutlinedIcon />, label: "30-Day Returns", sublabel: "Easy & Free" },
    { icon: <LockOutlinedIcon />, label: "Secure Checkout", sublabel: "SSL Encrypted" },
];

const TrustBadges = () => {
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {badges.map((badge) => (
                <Box
                    key={badge.label}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 0.5,
                    }}
                >
                    <Box sx={{ color: "#c8a951", fontSize: 28 }}>
                        {badge.icon}
                    </Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#333" }}>
                        {badge.label}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "#999" }}>
                        {badge.sublabel}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default TrustBadges;