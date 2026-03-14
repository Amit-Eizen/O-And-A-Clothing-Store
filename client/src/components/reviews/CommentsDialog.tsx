import { useState, useEffect } from "react";
import { Box, Typography, Avatar, Dialog, IconButton, TextField, Button, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Rating from "@mui/material/Rating";
import { fetchReviewComments, postComment } from "../../services/reviews-api";

interface Comment {
    name: string;
    avatarLetters: string;
    time: string;
    text: string;
}

interface CommentsDialogProps {
    open: boolean;
    onClose: () => void;
    reviewId: string;
    reviewerName: string;
    reviewerAvatarLetters: string;
    reviewRating: number;
    reviewText: string;
    onCommentAdded?: () => void;
}

const CommentsDialog = ({ open, onClose, reviewId, reviewerName, reviewerAvatarLetters, reviewRating, reviewText, onCommentAdded }: CommentsDialogProps) => {
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);

    const currentUserAvatar = localStorage.getItem("username")?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";

    useEffect(() => {
        if (!open) return;

        const loadComments = async () => {
            setLoading(true);
            try {
                const data = await fetchReviewComments(reviewId);
                setComments(data.map((c) => ({
                    name: c.userId.username,
                    avatarLetters: c.userId.username.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
                    time: new Date(c.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
                    text: c.content,
                })));
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setLoading(false);
            }
        };

        loadComments();
    }, [open, reviewId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const createdComment = await postComment(reviewId, newComment);
            setComments([...comments, {
                name: createdComment.userId.username,
                avatarLetters: createdComment.userId.username.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
                time: new Date(createdComment.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
                text: createdComment.content,
            }]);
            setNewComment("");
            if (onCommentAdded) {
                onCommentAdded();
            }
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography sx={{ fontSize: 20, fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>
                        Comments on {reviewerName}'s Review
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Original Review */}
                <Box sx={{ backgroundColor: "#f9f9f9", borderRadius: 1, p: 2.5, mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, backgroundColor: "#e0e0e0", color: "#666", fontSize: 12, fontWeight: 600 }}>
                            {reviewerAvatarLetters}
                        </Avatar>
                        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                            {reviewerName}
                        </Typography>
                        <Rating value={reviewRating} readOnly size="small" sx={{ color: "#c8a951" }} />
                    </Box>
                    <Typography sx={{ fontSize: 14, color: "#666", fontStyle: "italic" }}>
                        "{reviewText}"
                    </Typography>
                </Box>

                {/* Comments List */}
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                        <CircularProgress size={30} />
                    </Box>
                ) : (
                    <>
                        <Typography sx={{ fontWeight: 600, fontSize: 15, mb: 2 }}>
                            {comments.length} Comments
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: 3 }}>
                            {comments.map((comment, index) => (
                                <Box key={index} sx={{ display: "flex", gap: 1.5 }}>
                                    <Avatar sx={{ width: 36, height: 36, backgroundColor: "#f5f5f5", color: "#666", fontSize: 12, fontWeight: 600 }}>
                                        {comment.avatarLetters}
                                    </Avatar>
                                    <Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
                                                {comment.name}
                                            </Typography>
                                            <Typography sx={{ fontSize: 12, color: "#999" }}>
                                                {comment.time}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ fontSize: 14, color: "#444", mt: 0.5 }}>
                                            {comment.text}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </>
                )}

                {/* Write Comment */}
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                    <Avatar sx={{ width: 36, height: 36, backgroundColor: "#f5f5f5", color: "#666", fontSize: 12, fontWeight: 600 }}>
                        {currentUserAvatar}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            sx={{ mb: 1 }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            sx={{
                                backgroundColor: "#c8a951",
                                fontSize: 13,
                                fontWeight: 600,
                                "&:hover": { backgroundColor: "#b8993e" },
                            }}
                        >
                            Send →
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};

export default CommentsDialog;