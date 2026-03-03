import { Box, Typography, Grid } from "@mui/material";
import { Link } from "react-router-dom";

const footerLinks = {
    shop: [
        { label: "Women", path: "/women" },
        { label: "Men", path: "/men" },
        { label: "Accessories", path: "/accessories" },
        { label: "New Arrivals", path: "/" },
        { label: "Sale", path: "/" },
    ],

    help: [
        { label: "Customer Service", path: "/" },
        { label: "Shipping & Returns", path: "/" },
        { label: "Size Guide", path: "/" },
        { label: "FAQs", path: "/" },
        { label: "Contact Us", path: "/" },
    ],

    about: [
        { label: "Our Story", path: "/" },
        { label: "Sustainability", path: "/" },
        { label: "Careers", path: "/" },
        { label: "Press", path: "/" },
        { label: "Partners", path: "/" },
    ],
};

const linkStyle = {
    textDecoration: "none",
    color: "#9e9e9e",
    fontSize: 12.5,
    display: "block",
    marginBottom: 8,
    transition: "color 0.2s",
};

const Footer = () => {
    return (
        <Box sx={{ backgroundColor: "#1a1a1a", color: "#fff", pt: 8, pb: 4 }}>
            <Box sx={{ maxWidth: "1280px", mx: "auto", px: { xs: 2, md: 4 } }}>
                <Grid container spacing={6}>
                    {/* Logo & Tagline */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", mb: 2 }}>
                            <span style={{ fontWeight: "bold" }}>O&A</span>{" "}
                            <span style={{ color: "#c8a951" }}>Clothes</span>
                        </Typography>
                        <Typography sx={{ color: "#9e9e9e", fontSize: 13 }}>
                            Timeless elegance meets modern sophistication.
                        </Typography>
                    </Grid>

                    {/* Shop */}
                    <Grid size={{ xs: 6, md: 3 }}>
                        <Typography sx={{ fontWeight: 700, mb: 2, fontSize: 12.5, letterSpacing: 1 }}>SHOP</Typography>
                        {footerLinks.shop.map((link) => (
                            <Link key={link.label} to={link.path} style={linkStyle}>
                                {link.label}
                            </Link>
                        ))}
                    </Grid>

                    {/* Help */}
                    <Grid size={{ xs: 6, md: 3 }}>
                        <Typography sx={{ fontWeight: 700, mb: 2, fontSize: 12.5, letterSpacing: 1 }}>HELP</Typography>
                        {footerLinks.help.map((link) => (
                            <Link key={link.label} to={link.path} style={linkStyle}>
                                {link.label}
                            </Link>
                        ))}
                    </Grid>

                    {/* About */}
                    <Grid size={{ xs: 6, md: 3 }}>
                        <Typography sx={{ fontWeight: 700, mb: 2, fontSize: 12.5, letterSpacing: 1 }}>ABOUT</Typography>
                        {footerLinks.about.map((link) => (
                            <Link key={link.label} to={link.path} style={linkStyle}>
                                {link.label}
                            </Link>
                        ))}
                    </Grid>
                </Grid>

                {/* Bottom Bar */}
                <Box sx={{ borderTop: "1px solid #333", mt: 6, pt: 3, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                    <Typography sx={{ color: "#9e9e9e", fontSize: 12.5 }}>
                        &copy; 2025 O&A Clothes
                    </Typography>
                    <Box sx={{ display: "flex", gap: 3 }}>
                        <Link to="/privacy" style={{ ...linkStyle, marginBottom: 0 }}>Privacy</Link>
                        <Link to="/terms" style={{ ...linkStyle, marginBottom: 0 }}>Terms</Link>
                        <Link to="/cookies" style={{ ...linkStyle, marginBottom: 0 }}>Cookies</Link>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Footer;