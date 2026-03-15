import { Box, Typography, Breadcrumbs, Link as MuiLink, Snackbar } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import useProductDetail from "../hooks/useProductDetail";
import useProductReviews from "../hooks/useProductReviews";
import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";
import ImageGallery from "../components/product-detail/ImageGallery";
import ProductInfo from "../components/product-detail/ProductInfo";
import ProductTabs from "../components/product-detail/ProductTabs";

const ProductDetailPage = () => {
    const { category, id } = useParams<{ category: string; id: string }>();
    const { averageRating, total, reviewBreakdown } = useProductReviews(id);
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
    const { isInWishlist, toggleWishlist, snackMessage, closeSnack } = useWishlist();

    if (!product) {
        return null;
    }

    const productWithReviews = {
        ...product,
        rating: averageRating,
        reviewCount: total,
        reviewBreakdown,
    };

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
                            product={productWithReviews}
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
                            isInWishlist={isInWishlist(id!)}
                            onWishlistToggle={() => toggleWishlist(id!)}
                        />
                    </Box>
                </Box>

                {/* Tabs */}
                <Box sx={{ mt: 6 }}>
                    <ProductTabs
                        product={productWithReviews}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        reviewsLink={`/${category}/${id}/reviews`}
                    />
                </Box>
            </Box>
            <Snackbar
                open={snackMessage !== ""}
                autoHideDuration={3000}
                onClose={closeSnack}
                message={snackMessage}
            />
        </Box>
    );
};

export default ProductDetailPage;
