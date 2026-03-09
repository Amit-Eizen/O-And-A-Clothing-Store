import { useEffect, useState } from "react";
import { Box, Typography, Rating, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import apiClient from "../../services/api-client";

interface Comment {
    _id: string;
    content: string;
    createdAt: string;
    reviewId: {
        _id: string;
        title: string;
        rating: number;
        productId: {
            _id: string;
            name: string;
            images: string[];
            category: string;
        };
        userId: {
            username: string;
            profileImage?: string;
        };
    };
}

const MyCommentsSection = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [editComment, setEditComment] = useState<Comment | null>(null);
    const [editContent, setEditContent] = useState("");

    useEffect(() => {
        apiClient.get("/comments/user")
            .then((res) => setComments(res.data))
            .catch((err) => console.error("Failed to fetch comments:", err))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (commentId: string) => {
        const ok = confirm("Are you sure you want to delete this comment?");
        if (!ok) return;

        try {
            await apiClient.delete(`/comments/${commentId}`);
            setComments(comments.filter((c) => c._id !== commentId));
        } catch (err) {
            console.error("Failed to delete comment:", err);
        }
    };

    const openEdit = (comment: Comment) => {
        setEditComment(comment);
        setEditContent(comment.content);
    };

    const handleEdit = async () => {
        if (!editComment) return;
        try {
            await apiClient.put(`/comments/${editComment._id}`, { content: editContent });
            setComments(comments.map((c) => c._id === editComment._id ? { ...c, content: editContent } : c));
            setEditComment(null);
        } catch (err) {
            console.error("Failed to update comment:", err);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;

    if (comments.length === 0) {
        return (
            <Box>
                <Typography variant="h5" sx={{ mb: 1.5, fontFamily: "'Playfair Display', serif", fontSize: "1.75rem" }}>
                    My Comments
                </Typography>
                <Typography color="text.secondary">You haven't left any comments yet.</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 1.5, fontFamily: "'Playfair Display', serif", fontSize: "1.75rem" }}>
                My Comments
            </Typography>
            <Typography sx={{ mb: 3 }} color="text.secondary">
                Comments you've written on other reviews
            </Typography>

            {comments.map((comment) => (
                <Box key={comment._id} sx={{ border: "1px solid #e0e0e0", borderRadius: 2, mb: 3, overflow: "hidden" }}>
                    {/* Review Banner */}
                    <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2, backgroundColor: "#faf9f6", px: 3, py: 2, cursor: "pointer" }}
                        onClick={() => window.location.href = `/${comment.reviewId.productId.category}/${comment.reviewId.productId._id}`}
                    >
                        <Box
                            component="img"
                            src={`${apiClient.defaults.baseURL}${comment.reviewId.productId.images?.[0]}`}
                            sx={{ width: 60, height: 60, objectFit: "cover", borderRadius: 1 }}
                        />
                        <Box sx={{ flex: 1 }}>
                            <Typography fontWeight="bold">{comment.reviewId.productId.name}</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Review by {comment.reviewId.userId.username}
                                </Typography>
                                <Rating value={comment.reviewId.rating} readOnly size="small" />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                                "{comment.reviewId.title}"
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); openEdit(comment); }}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(comment._id); }}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Comment Content */}
                    <Box sx={{ px: 3, py: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {new Date(comment.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                        </Typography>
                        <Typography>{comment.content}</Typography>
                    </Box>
                </Box>
            ))}

            {/* Edit Dialog */}
            <Dialog open={!!editComment} onClose={() => setEditComment(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Comment</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Comment"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        multiline
                        rows={4}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditComment(null)}>Cancel</Button>
                    <Button onClick={handleEdit} variant="contained" sx={{ bgcolor: "#c8a951" }}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MyCommentsSection;