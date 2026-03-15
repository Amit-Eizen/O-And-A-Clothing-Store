import { useState } from "react";
import { Box, Typography, Avatar, Rating, Dialog, TextField, Button } from "@mui/material";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CommentsDialog from "./CommentsDialog";
import { toggleReviewLike, deleteReview, updateReview } from "../../services/reviews-api";
import OwnerActions from "./OwnerActions";

interface ReviewCardProps {
    reviewId: string,
    reviewerName: string;
    reviewerAvatar: string;
    date: string;
    rating: number;
    title: string;
    text: string;
    images: string[];
    helpfulCount: number;
    commentCount: number;
    likedByUser: string[];
    onReviewChanged?: () => void;
    reviewerUserId: string;
}

const ReviewCard = ({ reviewId, reviewerName, reviewerAvatar, date, rating, title, text, images, helpfulCount, commentCount, likedByUser, onReviewChanged, reviewerUserId }: ReviewCardProps) => {
    const userId = localStorage.getItem("userId");
    const isOwner = userId === reviewerUserId;
    const [liked, setLiked] = useState(userId ? likedByUser.includes(userId) : false);
    const [currentHelpfulCount, setCurrentHelpfulCount] = useState(helpfulCount);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [editData, setEditData] = useState<{ title: string; content: string; rating: number } | null>(null);

    const handleLike = async () => {
        if (liked) {
            setLiked(false);
            setCurrentHelpfulCount(currentHelpfulCount - 1);
        } else {
            setLiked(true);
            setCurrentHelpfulCount(currentHelpfulCount + 1);
        }

        try {
            await toggleReviewLike(reviewId);
        } catch (error) {
            setLiked(!liked);
            setCurrentHelpfulCount(helpfulCount);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            await deleteReview(reviewId);
            if (onReviewChanged) {
                onReviewChanged();
            }
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    const handleEdit = async () => {
        if (!editData || !editData.title.trim() || !editData.content.trim()) return;
        try {
            await updateReview(reviewId, { title: editData.title, content: editData.content, rating: editData.rating });
            setEditData(null);
            if (onReviewChanged) {
                onReviewChanged();
            }
        } catch (error) {
            console.error("Error updating review:", error);
        }
    };

    return (
        <Box sx={{ border: "1px solid #eee", borderRadius: 1, p: 2 }}>
            {/* Header - Avatar, Name, Date */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: "#f5f5f5", color: "#666", fontSize: 14, fontWeight: 600 }}>
                    {reviewerAvatar}
                </Avatar>
                <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                    {reviewerName}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#999", ml: "auto" }}>
                    {date}
                </Typography>
                <OwnerActions isOwner={isOwner} onEdit={() => setEditData({ title, content: text, rating })} onDelete={handleDelete} />
            </Box>

            {editData  ? (
                <Box sx={{ mb: 1.5 }}>
                    <Rating value={editData.rating} onChange={(_, val) => setEditData({ ...editData, rating: val || 1 })} size="small" sx={{ color: "#c8a951", mb: 1 }} />
                    <TextField fullWidth size="small" label="Title" value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} sx={{ mb: 1 }} />
                    <TextField fullWidth size="small" label="Content" multiline rows={3} value={editData.content} onChange={(e) => setEditData({ ...editData, content: e.target.value })} sx={{ mb: 1 }} />
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button size="small" onClick={handleEdit} variant="contained" sx={{ bgcolor: "#c8a951", fontSize: 12 }}>Save</Button>
                        <Button size="small" onClick={() => setEditData(null)} sx={{ fontSize: 12 }}>Cancel</Button>
                    </Box>
                </Box>
            ) : (
                <>
                    <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 1 }}>
                        {title}
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: "#666", mb: 1.5, lineHeight: 1.5 }}>
                        {text}
                    </Typography>
                </>
            )}

            {/* Images */}
            {images.length > 0 && (
                <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                    {images.map((img, index) => (
                        <Box
                            key={index}
                            component="img"
                            src={img}
                            alt={`Review Image ${index + 1}`}
                            onClick={() => setSelectedImage(img)}
                            sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1, cursor: "pointer", transition: "opacity 0.2s", "&:hover": { opacity: 0.7 } }}
                        />
                    ))}
                </Box>
            )}

            {/* Image Dialog */}
            <Dialog
                open={selectedImage !== null}
                onClose={() => setSelectedImage(null)}
                maxWidth="md"
            >
                <Box
                    component="img"
                    src={selectedImage || ""}
                    alt="Review image"
                    sx={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
                />
            </Dialog>

            {/* Helpful and Comment Counts */}
            <Box sx={{ display: "flex", gap: 3, alignItems: "center", pt: 1, borderTop: "1px solid #f5f5f5" }}>  
                <Box
                    onClick={handleLike}
                    sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer", "&:hover": { color: "#c8a951" } }}
                >
                    <ThumbUpOutlinedIcon sx={{ fontSize: 16, color: liked ? "#1976d2" : "#999" }} />
                    <Typography sx={{ fontSize: 13, color: liked ? "#1976d2" : "#999" }}>
                        Helpful ({currentHelpfulCount})
                    </Typography>
                </Box>
                <Box
                    onClick={() => setCommentsOpen(true)}
                    sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer", "&:hover": { color: "#c8a951" } }}
                >
                    <ChatBubbleOutlineIcon sx={{ fontSize: 16, color: "#999" }} />
                    <Typography sx={{ fontSize: 12, color: "#999" }}>
                        Comments ({commentCount})
                    </Typography>
                </Box>
            </Box>

            {/* Comments Dialog */}
            <CommentsDialog
                open={commentsOpen}
                onClose={() => setCommentsOpen(false)}
                reviewId={reviewId}
                reviewerName={reviewerName}
                reviewerAvatarLetters={reviewerAvatar}
                reviewRating={rating}
                reviewText={text}
                onCommentAdded={onReviewChanged}
            />
        </Box>
    );
};

export default ReviewCard;