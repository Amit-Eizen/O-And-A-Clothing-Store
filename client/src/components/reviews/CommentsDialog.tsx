import { useState, useEffect } from "react";
import { Box, Typography, Avatar, Dialog, IconButton, TextField, Button, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Rating from "@mui/material/Rating";
import { fetchReviewComments, postComment, deleteComment, updateComment } from "../../services/reviews-api";
import type { CommentFromServer } from "../../services/reviews-api";
import OwnerActions from "./OwnerActions";
import { getAvatarLetters, formatDate } from "../../utils/format";

interface Comment {
    id: string,
    userId: string
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
    const [submitting, setSubmitting] = useState(false);
    const [editingComment, setEditingComment] = useState<{ id: string; content: string } | null>(null);

    const currentUserAvatar = getAvatarLetters(localStorage.getItem("username") || "");

    const mapComment = (c: CommentFromServer): Comment => ({
        id: c._id,
        userId: c.userId._id,
        name: c.userId.username,
        avatarLetters: getAvatarLetters(c.userId.username),
        time: formatDate(c.createdAt),
        text: c.content,
    });

    useEffect(() => {
        if (!open) return;

        const loadComments = async () => {
            setLoading(true);
            try {
                const data = await fetchReviewComments(reviewId);
                setComments(data.map(mapComment));
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setLoading(false);
            }
        };

        loadComments();
    }, [open, reviewId]);

    const handleAddComment = async () => {
        if (!newComment.trim() || submitting) return;

        setSubmitting(true);
        try {
            const createdComment = await postComment(reviewId, newComment);
            setComments([...comments, mapComment(createdComment)]);
            setNewComment("");
            if (onCommentAdded) {
                onCommentAdded();
            }
        } catch (error) {
            console.error("Error posting comment:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            await deleteComment(commentId);
            setComments(comments.filter((c) => c.id !== commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleEditComment = async () => {
        if (!editingComment || !editingComment.content.trim()) return;
        try {
            await updateComment(editingComment.id, editingComment.content);
            setComments(comments.map((c) => c.id === editingComment.id ? { ...c, text: editingComment.content } : c));
            setEditingComment(null);
        } catch (error) {
            console.error("Error updating comment:", error);
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
                                   <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
                                                {comment.name}
                                            </Typography>
                                            <Typography sx={{ fontSize: 12, color: "#999" }}>
                                                {comment.time}
                                            </Typography>
                                            <OwnerActions
                                                isOwner={localStorage.getItem("userId") === comment.userId}
                                                onEdit={() => setEditingComment({ id: comment.id, content: comment.text })}
                                                onDelete={() => handleDeleteComment(comment.id)}
                                            />
                                        </Box>
                                        {editingComment && editingComment.id === comment.id ? (
                                            <Box sx={{ mt: 0.5 }}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    value={editingComment.content}
                                                    onChange={(e) => setEditingComment({ ...editingComment, content: e.target.value })}
                                                />
                                                <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                                                    <Button size="small" onClick={handleEditComment} sx={{ fontSize: 12 }}>Save</Button>
                                                    <Button size="small" onClick={() => setEditingComment(null)} sx={{ fontSize: 12 }}>Cancel</Button>
                                                </Box>
                                            </Box>
                                        ) : (
                                            <Typography sx={{ fontSize: 14, color: "#444", mt: 0.5 }}>
                                                {comment.text}
                                            </Typography>
                                        )}
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
                            disabled={!newComment.trim() || submitting}
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