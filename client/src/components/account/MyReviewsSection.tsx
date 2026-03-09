import { useEffect, useState } from "react";
import { Box, Typography, Rating, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import apiClient from "../../services/api-client";

interface Review {
    _id: string;
    productId: {
        _id: string;
        name: string;
        images: string[];
        price: number;
        category: string;
    };
    title: string;
    content: string;
    rating: number;
    images: string[];
    likes: string[];
    createdAt: string;
}

interface MyReviewsSectionProps {
    userId: string;
}

const MyReviewsSection = ({ userId }: MyReviewsSectionProps) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [editReview, setEditReview] = useState<Review | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editRating, setEditRating] = useState(5);

    useEffect(() => {
         apiClient.get(`/reviews/user/${userId}`)
            .then((res) => setReviews(res.data))
            .catch((err) => console.error("Failed to fetch reviews:", err))
            .finally(() => setLoading(false));
    }, [userId]);

    const handleDelete = async (reviewId: string) => {
        const ok = confirm("Are you sure you want to delete this review?");
        if (!ok) return;

        try {
            await apiClient.delete(`/reviews/${reviewId}`);
            setReviews(reviews.filter((r) => r._id !== reviewId));
        } catch (err) {
            console.error("Failed to delete review:", err);
        }
    };

    const openEdit = (review: Review) => {
        setEditReview(review);
        setEditTitle(review.title);
        setEditContent(review.content);
        setEditRating(review.rating);
    };

    const handleEdit = async () => {
        if (!editReview) return;
        try {
            const res = await apiClient.put(`/reviews/${editReview._id}`, {
                title: editTitle,
                content: editContent,
                rating: editRating,
            });
            setReviews(reviews.map((r) => r._id === editReview._id ? { ...r, title: editTitle, content: editContent, rating: editRating } : r));
            setEditReview(null);
        } catch (err) {
            console.error("Failed to update review:", err);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;

    if (reviews.length === 0) {
        return (
            <Box>
                <Typography variant="h5" sx={{ mb: 1.5, fontFamily: "'Playfair Display', serif", fontSize: "1.75rem" }}>
                    My Reviews
                </Typography>
                <Typography color="text.secondary">You haven't written any reviews yet.</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 1.5, fontFamily: "'Playfair Display', serif", fontSize: "1.75rem" }}>
                My Reviews
            </Typography>
            <Typography sx={{ mb: 3 }} color="text.secondary">
                Reviews you've written
            </Typography>

           {reviews.map((review) => (
               <Box key={review._id} sx={{ border: "1px solid #e0e0e0", borderRadius: 2, mb: 3, overflow: "hidden" }}>
                   {/* Product Banner */}
                   <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2, backgroundColor: "#faf9f6", px: 3, py: 2, cursor: "pointer" }}
                        onClick={() => window.location.href = `/${review.productId.category}/${review.productId._id}`}
                     >
                        <Box
                            component="img"
                            src={`${apiClient.defaults.baseURL}${review.productId.images?.[0]}`}
                            sx={{ width: 60, height: 60, objectFit: "cover", borderRadius: 1 }}
                        />
                        <Box sx={{ flex: 1 }}>
                            <Typography fontWeight="bold">{review.productId.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); openEdit(review); }}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(review._id); }}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Review Content */}
                    <Box sx={{ px: 3, py: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <Rating value={review.rating} readOnly size="small" />
                        </Box>
                        <Typography fontWeight="bold" sx={{ mb: 0.5 }}>{review.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{review.content}</Typography>

                        {review.images?.length > 0 && (
                            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                                {review.images.map((img, i) => (
                                    <Box key={i} component="img" src={`${apiClient.defaults.baseURL}${img}`} sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1 }} />
                                ))}
                            </Box>
                        )}

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {review.likes?.length || 0} people found this helpful
                        </Typography>
                    </Box>
                </Box>
            ))}

            {/* Edit Dialog */}
            <Dialog open={!!editReview} onClose={() => setEditReview(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Review</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1 }}>
                        <Typography sx={{ mb: 1 }}>Rating</Typography>
                        <Rating value={editRating} onChange={(_, val) => setEditRating(val || 1)} sx={{ mb: 2 }} />
                        <TextField fullWidth label="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} sx={{ mb: 2 }} />
                        <TextField fullWidth label="Content" value={editContent} onChange={(e) => setEditContent(e.target.value)} multiline rows={4} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditReview(null)}>Cancel</Button>
                    <Button onClick={handleEdit} variant="contained" sx={{ bgcolor: "#c8a951" }}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MyReviewsSection;
