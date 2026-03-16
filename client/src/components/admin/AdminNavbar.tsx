import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LogoutIcon from "@mui/icons-material/Logout";
import { logoutUser } from "../../services/auth-service";
import { useNavigate } from "react-router-dom";

interface NavItem {
    key: string;
    label: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { key: "stats", label: "Dashboard", icon: <DashboardIcon sx={{ fontSize: 18 }} /> },
    { key: "orders", label: "Orders", icon: <ShoppingCartIcon sx={{ fontSize: 18 }} /> },
    { key: "products", label: "Products", icon: <InventoryIcon sx={{ fontSize: 18 }} /> },
    { key: "users", label: "Users", icon: <PeopleIcon sx={{ fontSize: 18 }} /> },
    { key: "settings", label: "Settings", icon: <SettingsIcon sx={{ fontSize: 18 }} /> },
];

interface AdminNavbarProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

const AdminNavbar = ({ activeSection, onSectionChange }: AdminNavbarProps) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate("/auth");
    };

    return (
        <AppBar position="sticky" elevation={0} sx={{ backgroundColor: "#fff", color: "#000", borderBottom: "2px solid #c8a951" }}>
            <Toolbar sx={{ justifyContent: "space-between", maxWidth: 1400, width: "100%", mx: "auto", px: { xs: 2, md: 4 }, minHeight: 64 }}>
                {/* Logo */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif" }}>
                        <span style={{ fontWeight: "bold" }}>O&A</span>
                        <span style={{ color: "#c8a951" }}> Clothes</span>
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.5 }}>
                        ADMIN DASHBOARD
                    </Typography>
                </Box>

                {/* Nav Links */}
                <Box sx={{ display: "flex", gap: 1 }}>
                    {navItems.map((item) => (
                        <Button
                            key={item.key}
                            startIcon={item.icon}
                            onClick={() => onSectionChange(item.key)}
                            sx={{
                                color: activeSection === item.key ? "#000" : "text.secondary",
                                fontWeight: activeSection === item.key ? 600 : 400,
                                bgcolor: activeSection === item.key ? "#f5f5f5" : "transparent",
                                borderRadius: 2,
                                px: 2,
                                textTransform: "none",
                                "&:hover": { bgcolor: "#f5f5f5" },
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>

                {/* Actions */}
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        component={Link}
                        to="/"
                        startIcon={<StorefrontIcon />}
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            borderColor: "#ddd",
                            color: "#000",
                            "&:hover": { borderColor: "#c8a951" },
                        }}
                    >
                        View Store
                    </Button>
                    <Button
                        onClick={handleLogout}
                        startIcon={<LogoutIcon />}
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            bgcolor: "#000",
                            "&:hover": { bgcolor: "#333" },
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AdminNavbar;
