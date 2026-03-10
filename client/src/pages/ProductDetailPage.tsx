import { Box, Typography, Breadcrumbs, Link as MuiLink } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import useProductDetail from "../hooks/useProductDetail";
import useCart from "../hooks/useCart";
import ImageGallery from "../components/product-detail/ImageGallery";
import ProductInfo from "../components/product-detail/ProductInfo";
import ProductTabs from "../components/product-detail/ProductTabs";

const ProductDetailPage = () => {
    const { category, id } = useParams<{ category: string; id: string }>();
    const {
        product,
        selectedImageIndex,
        setSelectedImageIndex,
        selectedColor,
        setSelectedColor,
        selectedSize,
        setSelectedSize,
        quantity,
        incrementQuantity,
        decrementQuantity,
        activeTab,
        setActiveTab,
        savings,
    } = useProductDetail(id);

    const { addItem } = useCart();

    if (!product) {
        return null;
    }

    const handleAddToCart = () => {
        addItem({
            productId: product.id.toString(),
            name: product.name,
            type: product.type,
            size: selectedSize,
            color: selectedColor,
            price: product.price,
            image: product.images[0].src,
            category: product.category,
        }, quantity);
    };

    return (
        <Box>
            {/* Breadcrumb */}
            <Box sx={{ backgroundColor: "#f5f5f5", py: 1.5 }}>
                <Box sx={{ maxWidth: "1280px", mx: "auto", px: { xs: 2, md: 4 } }}>
                    <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 16 }} />}>
                        <MuiLink
                            component={Link}
                            to="/"
                            sx={{ color: "#666", textDecoration: "none", fontSize: 14 }}
                        >
                            Home
                        </MuiLink>
                        <MuiLink
                            component={Link}
                            to={`/${category}`}
                            sx={{
                                color: "#666",
                                textDecoration: "none",
                                fontSize: 14,
                                textTransform: "capitalize",
                            }}
                        >
                            {category}
                        </MuiLink>
                        <Typography sx={{ fontSize: 14, color: "#999" }}>
                            {product.type}
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: "#c8a951", fontWeight: 500 }}>
                            {product.name}
                        </Typography>
                    </Breadcrumbs>
                </Box>
            </Box>

            {/* Main Content */}
            <Box sx={{ maxWidth: "1280px", mx: "auto", px: { xs: 2, md: 4 }, py: 4 }}>
                <Box
                    sx={{
                        display: "flex",
                        gap: 6,
                        flexDirection: { xs: "column", md: "row" },
                    }}
                >
                    {/* Left - Image Gallery */}
                    <Box sx={{ flex: 1 }}>
                        <ImageGallery
                            images={product.images}
                            selectedIndex={selectedImageIndex}
                            onSelectIndex={setSelectedImageIndex}
                        />
                    </Box>

                    {/* Right - Product Info */}
                    <Box sx={{ flex: 1 }}>
                        <ProductInfo
                            product={product}
                            selectedColor={selectedColor}
                            onColorChange={(color) => {
                                setSelectedColor(color);
                                const colorObj = product.colors.find((c) => c.name === color);
                                if (colorObj) {
                                    setSelectedImageIndex(colorObj.imageIndex);
                                }
                            }}
                            selectedSize={selectedSize}
                            onSizeChange={setSelectedSize}
                            quantity={quantity}
                            onIncrement={incrementQuantity}
                            onDecrement={decrementQuantity}
                            savings={savings}
                            onAddToCart={handleAddToCart}
                        />
                    </Box>
                </Box>

                {/* Tabs */}
                <Box sx={{ mt: 6 }}>
                    <ProductTabs
                        product={product}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        reviewsLink={`/${category}/${id}/reviews`}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default ProductDetailPage;
