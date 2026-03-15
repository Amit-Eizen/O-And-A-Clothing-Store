import { Box, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/format";

const heroImage = getImageUrl("/public/images/hero/hero-image.jpg");

const HeroSection = () => {
    return (
        <Box
            sx={{
                position: "relative",
                height: "90vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "#fff",
            }}
        >
            {/* Background Image */}
            <Box
                component="img"
                src={heroImage}
                alt="Hero"
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: -1,
                }}
            />

            {/* Dark Overlay */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    zIndex: 0,
                }}
            />
            
            {/* Content */}
            <Box sx={{ zIndex: 1 }}>
                <Typography
                    sx={{
                        fontSize: 13,
                        letterSpacing: 4,
                        color: "#c8a951",
                        mb: 2,
                    }}
                >
                    SPRING COLLECTION 2025
                </Typography>

                <Typography
                    variant="h2"
                    sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 400,
                        fontSize: { xs: 40, md: 64 },
                        mb: 2,
                    }}
                >
                    Timeless Elegance
                </Typography>

                <Typography
                    sx={{
                        fontSize: 16,
                        mb: 4,
                        color: "#e0e0e0"
                    }}
                >
                    Discover our new collection of classic and sophisticated clothing.
                </Typography>

                <Button
                    component={Link}
                    to="/women"
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                        color: "#fff",
                        borderColor: "#c8a951",
                        px: 4,
                        py: 1.5,
                        fontSize: 14,
                        "&:hover": {
                            backgroundColor: "#c8a951",
                            borderColor: "#c8a951",
                            color: "#000",
                        },
                        transition: "all 0.3s",
                    }}
                >
                    Shop Collection
                </Button>
            </Box>
        </Box>
    );
};

export default HeroSection;

