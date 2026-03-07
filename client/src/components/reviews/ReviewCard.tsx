import { useState } from "react";
import { Box, Typography, Avatar, Rating, Dialog } from "@mui/material";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CommentsDialog from "./CommentsDialog";

interface ReviewCardProps {
    reviewerName: string;
    reviewerAvatar: string;
    date: string;
    rating: number;
    title: string;
    text: string;
    images: string[];
    helpfulCount: number;
    commentCount: number;
    comments: { name: string; avatarLetters: string; time: string; text: string }[];
}

const ReviewCard = ({ reviewerName, reviewerAvatar, date, rating, title, text, images, helpfulCount, commentCount, comments }: ReviewCardProps) => {
    const [liked, setLiked] = useState(false);
    const [currentHelpfulCount, setCurrentHelpfulCount] = useState(helpfulCount);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [commentsOpen, setCommentsOpen] = useState(false);

    const handleLike = () => {
        if (liked) {
            setLiked(false);
            setCurrentHelpfulCount(currentHelpfulCount - 1);
        } else {
            setLiked(true);
            setCurrentHelpfulCount(currentHelpfulCount + 1);
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
            </Box>

            {/* Rating */}
            <Rating value={rating} readOnly size="small" sx={{ color: "#c8a951", mb: 1 }} />

            {/* Title */}
            <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 1 }}>
                {title}
            </Typography>

            {/* Review Text */}
            <Typography sx={{ fontSize: 14, color: "#666", mb: 1.5, lineHeight: 1.5 }}>
                {text}
            </Typography>

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
                reviewerName={reviewerName}
                reviewerAvatarLetters={reviewerAvatar}
                reviewRating={rating}
                reviewText={text}
                comments={comments}
            />
        </Box>
    );
};

export default ReviewCard;