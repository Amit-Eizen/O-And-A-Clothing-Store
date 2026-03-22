import { AppBar, Toolbar, Box, Typography, IconButton, Badge, Button, Drawer, List, ListItem, ListItemText, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { useState } from "react";
import useCart from "../../hooks/useCart";
import { isAdmin } from "../../utils/adminAuth";

const navLinks = [
    { label: "Women", path: "/women" },
    { label: "Men", path: "/men" },
    { label: "Accessories", path: "/accessories" },
];

const Navbar = () => {
    const { itemCount } = useCart();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <AppBar position="sticky" elevation={0} sx={{ backgroundColor: "#fff", color: "#000"}}>
            <Toolbar sx={{ justifyContent: "space-between", maxWidth: "1280px", width: "100%", mx: "auto", px: { xs: 2, md: 4 }, minHeight: 56 }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                    <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif" }}>
                        <span style={{ fontWeight: "bold" }}>O&A</span>{""}
                        <span style={{ color: "#c8a951" }}> Clothes</span>
                    </Typography>
                </Link>

                {/* Navigation Links */}
                <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >

                        <Typography
                            sx={{
                                fontSize: 13,
                                fontWeight: 500,
                                "&:hover": { color: "#c8a951" },
                                transition: "color 0.2s",
                            }}
                        >
                            {link.label}
                        </Typography>
                        </Link>
                    ))}
                </Box>

                {/* Action Icons */}
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    {isAdmin() ? (
                        <Button
                            component={Link}
                            to="/admin"
                            startIcon={<ArrowBackIcon />}
                            sx={{ textTransform: "none", color: "#000", fontWeight: 500, "&:hover": { color: "#c8a951" } }}
                        >
                            Back to Admin Dashboard
                        </Button>
                    ) : (
                        <>
                            <IconButton
                                size="small"
                                onClick={() => setMobileOpen(true)}
                                sx={{ display: { xs: "flex", md: "none" } }}
                            >
                                <MenuIcon sx={{ fontSize: 20 }} />
                            </IconButton>

                            <IconButton size="small" component={Link} to="/search">
                                <SearchIcon sx={{ fontSize: 20 }}/>
                            </IconButton>

                            <IconButton size="small" component={Link} to="/account?section=wishlist">
                                <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                            </IconButton>

                            <IconButton size="small" component={Link} to="/account">
                                <PersonOutlineIcon sx={{ fontSize: 20 }} />
                            </IconButton>

                            <IconButton size="small" component={Link} to="/cart">
                                <Badge badgeContent={itemCount} color="primary" sx={{ "& .MuiBadge-badge": { backgroundColor: "#c8a951", fontSize: 11, minWidth: 16, height: 18 } }}>
                                    <ShoppingBagOutlinedIcon sx={{ fontSize: 20 }} />
                                </Badge>
                            </IconButton>
                        </>
                    )}
                </Box>
            </Toolbar>
            {/* Mobile Drawer */}
            <Drawer 
                anchor="left"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
            >
                <Box sx={{ width: 250, p: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif" }}>
                            <span style={{ fontWeight: "bold" }}>O&A</span>{""}
                            <span style={{ color: "#c8a951" }}> Clothes</span>
                        </Typography>
                        <IconButton onClick={() => setMobileOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Divider />
                    <List>
                        {navLinks.map((link) => (
                            <ListItem 
                                key={link.path}
                                component={Link}
                                to={link.path}
                                onClick={() => setMobileOpen(false)}
                                sx={{ color: "#000", "&:hover": { color: "#c8a951" } }}
                            >
                                <ListItemText primary={link.label} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </AppBar>
    );
}

export default Navbar;