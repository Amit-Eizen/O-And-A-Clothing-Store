import { AppBar, Toolbar, Box, Typography, IconButton, Badge } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonOutLineIcon from "@mui/icons-material/PersonOutline";
import ShoppingBagOutLinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Link } from "react-router-dom";

const navLinks = [
    { label: "Women", path: "/women" },
    { label: "Men", path: "/men" },
    { label: "Accessories", path: "/accessories" },
];

const Navbar = () => {
    return (
        <AppBar position="sticky" elevation={0} sx={{ backgroundColor: "#fff", color: "#000"}}>
            <Toolbar sx={{ justifyContent: "space-between", maxWidth: "1280px", width: "100%", mx: "auto", px: { xs: 2, md: 4 }, minHeight: 56 }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                    <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif" }}>
                        <span style={{ fontWeight: "bold" }}>O&A</span>{""}
                        <span style={{ color: "#c8a951" }}>Clothes</span>
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
                <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton size="small" component={Link} to="/search">
                        <SearchIcon sx={{ fontSize: 20 }}/>
                    </IconButton>

                    <IconButton size="small" >
                        <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                    </IconButton>

                    <IconButton size="small" component={Link} to="/account">
                        <PersonOutLineIcon sx={{ fontSize: 20 }} />
                    </IconButton>

                    <IconButton size="small" component={Link} to="/cart">
                        <Badge badgeContent={3} color="primary" sx={{ "& .MuiBadge-badge": { backgroundColor: "#c8a951", fontSize: 11, minWidth: 16, height: 18 } }}>
                            <ShoppingBagOutLinedIcon sx={{ fontSize: 20 }} />
                        </Badge>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;