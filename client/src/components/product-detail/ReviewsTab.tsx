import { Box, Typography, Rating, Button, LinearProgress } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface ReviewsTabProps {
    rating: number;
    reviewCount: number;
    reviewBreakdown: { stars: number; percentage: number }[];
    reviewsLink: string;
}

const ReviewsTab = ({ rating, reviewCount, reviewBreakdown, reviewsLink }: ReviewsTabProps) => {
    if (reviewCount === 0) {
        return (
            <Box sx={{ py: 6, textAlign: "center" }}>
                <StarBorderIcon sx={{ fontSize: 48, color: "#ccc", mb: 2 }} />
                <Typography sx={{ fontSize: 20, fontWeight: 600, mb: 1 }}>
                    No Reviews Yet
                </Typography>
                <Typography sx={{ fontSize: 14, color: "#999", mb: 3, maxWidth: 400, mx: "auto" }}>
                    This product hasn't received any reviews yet. Be the first to share your experience and help other customers make informed decisions.
                </Typography>
                {/* <Button
                    component={Link}
                    to={reviewsLink}
                    variant="contained"
                    startIcon={<ChatBubbleOutlineIcon />}
                    sx={{
                        backgroundColor: "#c8a951",
                        fontSize: 13,
                        letterSpacing: 1,
                        textDecoration: "none",
                        "&:hover": {
                            backgroundColor: "#b8993e",
                        },
                    }}
                >
                    WRITE FIRST REVIEW
                </Button> */}
            </Box>
        );
    }

    return (
        <Box sx={{ py: 3 }}>
            {/* Overall Rating */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Typography sx={{ fontSize: 48, fontWeight: 700 }}>
                    {rating}
                </Typography>
                <Box>
                    <Rating value={rating} precision={0.5} readOnly sx={{ color: "#c8a951" }} />
                    <Typography sx={{ fontSize: 13, color: "#999", mt: 0.5 }}>
                        Based on {reviewCount} reviews
                    </Typography>
                </Box>
            </Box>

            {/* Rating Breakdown */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 4, maxWidth: 400 }}>
                {reviewBreakdown.map((row) => (
                    <Box key={row.stars} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography sx={{ fontSize: 13, color: "#666", minWidth: 50 }}>
                            {row.stars} stars
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={row.percentage}
                            sx={{
                                flex: 1,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: "#eee",
                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#c8a951",
                                    borderRadius: 4,
                                },
                            }}
                        />
                        <Typography sx={{ fontSize: 13, color: "#999", minWidth: 35 }}>
                            {row.percentage}%
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* View All Reviews Button */}
            <Button
                component={Link}
                to={reviewsLink}
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                sx={{
                    borderColor: "#c8a951",
                    color: "#c8a951",
                    fontSize: 13,
                    letterSpacing: 1,
                    textDecoration: "none",
                    "&:hover": {
                        borderColor: "#b8993e",
                        backgroundColor: "rgba(200, 169, 81, 0.04)",
                    },
                }}
            >
                VIEW ALL {reviewCount} REVIEWS
            </Button>
        </Box>
    );
};

export default ReviewsTab;
