import { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Typography, IconButton, TextField, Rating, Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { createReview } from "../../services/reviews-api";

interface WriteReviewDialogProps {
    open: boolean;
    onClose: () => void;
    productId: string;
    productName: string;
    onSuccess?: () => void;
}

const WriteReviewDialog = ({ open, onClose, productId, productName, onSuccess }: WriteReviewDialogProps) => {
    const [rating, setRating] = useState<number | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages([...images, ...newFiles]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!rating) {
            setError("Please select a rating");
            return;
        }

        if (!title.trim()) {
            setError("Please enter a title");
            return;
        }

        if (!content.trim()) {
            setError("Please write your review");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            await createReview(productId, title.trim(), content.trim(), rating, images);
            setRating(null);
            setTitle("");
            setContent("");
            setImages([]);
            onClose();
            if (onSuccess) {
                onSuccess();
            }
        } catch (err: any) {
            const message = err.response?.data?.message || "Failed to submit review";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography component="span" variant="h6" sx={{ fontFamily: "'Playfair Display', serif" }}>
                    Write a Review
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Typography sx={{ fontSize: 14, color: "#666", mb: 3 }}>
                    {productName}
                </Typography>

                {/* Rating */}
                <Typography sx={{ fontWeight: 700, fontSize: 11, letterSpacing: 1, mb: 1 }}>RATING</Typography>
                <Rating
                    value={rating}
                    onChange={(_, value) => setRating(value)}
                    sx={{ color: "#c8a951", mb: 3 }}
                    size="large"
                />

                {/* Title */}
                <TextField
                    label="Review Title"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ mb: 2 }}
                    size="small"
                />

                {/* Content */}
                <TextField
                    label="Your Review"
                    fullWidth
                    multiline
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {/* Images */}
                <Typography sx={{ fontWeight: 700, fontSize: 11, letterSpacing: 1, mb: 1 }}>PHOTOS (OPTIONAL)</Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                    {images.map((image, index) => (
                        <Box key={index} sx={{ position: "relative", width: 80, height: 80 }}>
                            <Box
                                component="img"
                                src={URL.createObjectURL(image)}
                                sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 1 }}
                            />
                            <IconButton
                                size="small"
                                onClick={() => removeImage(index)}
                                sx={{ position: "absolute", top: -8, right: -8, backgroundColor: "#fff", width: 20, height: 20, "&:hover": { backgroundColor: "#f0f0f0" } }}
                            >
                                <CloseIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                        </Box>
                    ))}
                    <Button
                        component="label"
                        variant="outlined"
                        sx={{ width: 80, height: 80, borderStyle: "dashed", borderColor: "#ccc", color: "#999" }}
                    >
                        <AddPhotoAlternateIcon />
                        <input type="file" hidden accept="image/*" multiple onChange={handleImageChange} />
                    </Button>
                </Box>

                {/* Error */}
                {error && (
                    <Typography sx={{ color: "error.main", fontSize: 13 }}>
                        {error}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} sx={{ color: "#999" }}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting}
                    sx={{
                        backgroundColor: "#c8a951",
                        fontWeight: 600,
                        fontSize: 12,
                        letterSpacing: 1,
                        "&:hover": { backgroundColor: "#b89841" },
                    }}
                >
                    {submitting ? "SUBMITTING..." : "SUBMIT REVIEW"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WriteReviewDialog;