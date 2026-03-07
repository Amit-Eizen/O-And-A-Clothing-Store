import { useState } from "react";
import { Box, Typography, Avatar, Dialog, IconButton, TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Rating from "@mui/material/Rating";

interface Comment {
    name: string;
    avatarLetters: string;
    time: string;
    text: string;
}

interface CommentsDialogProps {
    open: boolean;
    onClose: () => void;
    reviewerName: string;
    reviewerAvatarLetters: string;
    reviewRating: number;
    reviewText: string;
    comments: Comment[];
}

const CommentsDialog = ({ open, onClose, reviewerName, reviewerAvatarLetters, reviewRating, reviewText, comments }: CommentsDialogProps) => {
    const [newComment, setNewComment] = useState("");

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

                {/* Write Comment */}
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                    <Avatar sx={{ width: 36, height: 36, backgroundColor: "#f5f5f5", color: "#666", fontSize: 12, fontWeight: 600 }}>
                        YO
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
