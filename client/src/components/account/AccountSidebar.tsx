import { Box, Avatar, Typography, List, ListItemButton, ListItemIcon, 
    ListItemText, Divider, Button, Dialog } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logoutUser } from "../../services/auth-service";
import apiClient from "../../services/api-client";

const AccountSidebarItems = [
    { key: "orders", label: "Order History", icon: <ShoppingBagOutlinedIcon /> },
    { key: "reviews", label: "My Reviews", icon: <RateReviewOutlinedIcon /> },
    { key: "comments", label: "My Comments", icon: <ChatBubbleOutlineIcon /> },
    { key: "wishlist", label: "Wishlist", icon: <FavoriteBorderIcon /> },
    { key: "settings", label: "Account Settings", icon: <SettingsOutlinedIcon /> },
];

interface AccountSidebarProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
    username: string;
    email: string;
    profileImage?: string;
}

const AccountSidebar = ({ activeSection, onSectionChange, username, email, profileImage }: AccountSidebarProps) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate("/");
    };

    const avatarSrc = profileImage ? `${apiClient.defaults.baseURL}${profileImage}` : "";
    const [imageOpen, setImageOpen] = useState(false);

    return (
        <Box sx={{ width: 280,  minHeight: "calc(100vh - 64px)", p: 3 }}>
            {/* Title */}
            <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", textAlign: "center", mb: 3, fontSize: "2.5rem" }}>
                My Account
            </Typography>
            
            {/* User Info */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
                <Avatar
                    src={avatarSrc}
                    onClick={() => avatarSrc && setImageOpen(true)}
                    sx={{ width: 120, height: 120, bgcolor: "#c8a951", fontSize: 32, mx: "auto", mb: 2.5, cursor: avatarSrc ? "pointer" : "default" }}
                >
                    {!profileImage && username?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography fontWeight="bold" sx={{ mb: 1 }}>{username}</Typography>
                <Typography variant="body2" color="text.secondary">{email}</Typography>
            </Box>

            {/* Image Dialog */}
            <Dialog open={imageOpen} onClose={() => setImageOpen(false)} maxWidth="sm" >
                <Box
                    component="img"
                    src={avatarSrc}
                    sx={{ width: "100%", maxWidth: 400, objectFit: "contain" }}
                />
            </Dialog>

            <Divider sx={{ mb: 2 }} />

            {/* Navigation */}
            <List disablePadding>
                {AccountSidebarItems.map((item) => (
                    <ListItemButton
                        key={item.key}
                        selected={activeSection === item.key}
                        onClick={() => onSectionChange(item.key)}
                        sx={{ 
                            borderRadius: 1,
                            mb: 0.5,
                            borderLeft: activeSection === item.key ? "3px solid #c8a951" : "3px solid transparent",
                            "&.Mui-selected": {
                                backgroundColor: "rgba(200, 169, 81, 0.08)",
                            },
                            "&.Mui-selected:hover": {
                                backgroundColor: "rgba(200, 169, 81, 0.12)",
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: activeSection === item.key ? "#c8a951" : "inherit" }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>

            {/* Logout Button */}
            <Button
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ mt: 4, color: "red", textTransform: "none" }}
            >
                Logout
            </Button>
        </Box>
    );
};

export default AccountSidebar;
