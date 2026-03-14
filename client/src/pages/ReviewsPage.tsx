import { Box, Typography, Select, MenuItem } from "@mui/material";
import { useParams } from "react-router-dom";
import useProductDetail from "../hooks/useProductDetail";
import useProductReviews from "../hooks/useProductReviews";
import ProductSidebar from "../components/reviews/ProductSidebar";
import ReviewCard from "../components/reviews/ReviewCard";

const ReviewsPage = () => {
    const { category, id } = useParams<{ category: string; id: string }>();
    const { product } = useProductDetail(id);
    const { reviews, sortBy, setSortBy, averageRating, total, reviewBreakdown, loading, reloadReviews } = useProductReviews(id);

    if (!product) {
        return null;
    }

    return (
        <Box sx={{ maxWidth: "1280px", mx: "auto", px: { xs: 2, md: 4 }, py: 4 }}>
            <Box sx={{ display: "flex", gap: 6, flexDirection: { xs: "column", md: "row" } }}>
                {/* Left - Product Sidebar */}
                <Box sx={{ width: { xs: "100%", md: 300 }, flexShrink: 0 }}>
                    <ProductSidebar
                        image={product.images[0].src}
                        name={product.name}
                        type={product.type}
                        rating={averageRating}
                        price={product.price}
                        reviewBreakdown={reviewBreakdown}
                        backLink={`/${category}/${id}`}
                    />
                </Box>

                {/* Right - Reviews List */}
                <Box sx={{ flex: 1 }}>
                    {/* Header */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                        <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", color: "#c8a951" }}>
                            Customer Reviews
                        </Typography>
                        <Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            size="small"
                            sx={{ minWidth: 160, fontSize: 13 }}
                        >
                            <MenuItem value="newest">Newest First</MenuItem>
                            <MenuItem value="highest">Highest Rated</MenuItem>
                            <MenuItem value="lowest">Lowest Rated</MenuItem>
                            <MenuItem value="helpful">Most Helpful</MenuItem>
                        </Select>
                    </Box>

                    {/* Review Count */}
                    <Typography sx={{ fontSize: 14, color: "#999", mb: 3 }}>
                        {total} reviews
                    </Typography>

                    {/* Review Cards */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {reviews.map((review) => (
                            <ReviewCard 
                                key={review.id}
                                reviewId={review.id}
                                reviewerName={review.name}
                                reviewerAvatar={review.avatarLetters}
                                date={review.date}
                                rating={review.rating}
                                title={review.title}
                                text={review.text}
                                images={review.images}
                                helpfulCount={review.helpfulCount}
                                commentCount={review.commentCount}
                                likedByUser={review.likedByUser}
                                onReviewChanged={reloadReviews}
                            />
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ReviewsPage;
