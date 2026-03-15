import { Box, Typography, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/format";

const womenImage = getImageUrl("/public/images/categories/category-women.jpg");
const menImage = getImageUrl("/public/images/categories/category-men.jpg");
const accessoriesImage = getImageUrl("/public/images/categories/category-accessories.jpg");

const categories = [
    { label: "Women", image: womenImage, path: "/women" },
    { label: "Men", image: menImage, path: "/men" },
    { label: "Accessories", image: accessoriesImage, path: "/accessories" },
];

const CategorySection = () => {
    return (
        <Box sx={{ backgroundColor: "#f9f9f9" }}>
            <Box sx={{ py: 10, maxWidth: "1280px", mx: "auto", px: { xs: 2, md: 4 }, textAlign: "center" }}>
            <Typography sx={{ fontSize: 13, letterSpacing: 4, color: "#c8a951", mb: 1 }}>
                COLLECTIONS
            </Typography>
            <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", mb: 6 }}>
                Shop by Category
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                {categories.map((category) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category.label}>
                        <Link to={category.path} style={{ textDecoration: "none", color: "inherit" }}>
                            <Box
                                sx={{
                                    position: "relative",
                                    height: 435,
                                    overflow: "hidden",
                                    borderRadius: 1,
                                    "&:hover img": { transform: "scale(1.05)" },
                                }}
                            >
                                <Box
                                    component="img"
                                    src={category.image}
                                    alt={category.label}
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        transition: "transform 0.4s ease",
                                    }}
                                />

                                {/* Dark overlay */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                                    }}
                                />

                                { /* Overlay */ }
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        p: 3,
                                        background: "linear-gradient(transparent, rgba(0, 0, 0, 0.6))",
                                        color: "#fff",
                                        textAlign: "center",
                                    }}
                                >
                                    <Typography variant="h5" sx={{ fontFamily: "'Playfair', serif", mb: 0.5 }}>
                                        {category.label}
                                    </Typography>
                                    <Typography sx={{ fontSize: 12, letterSpacing: 2, fontWeight: 500 }}>
                                        SHOP NOW
                                    </Typography>
                                </Box>
                            </Box>
                        </Link>
                    </Grid>
                ))}
            </Grid>
            </Box>
        </Box>
    );
};

export default CategorySection;