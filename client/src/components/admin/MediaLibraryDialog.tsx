import { useEffect, useState } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tabs, Tab, CircularProgress } from "@mui/material";
import { fetchMediaLibrary, uploadMediaImages } from "../../services/admin-api";
import type { MediaImage } from "../../services/admin-api";
import { getImageUrl } from "../../utils/format";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FileUploadIcon from "@mui/icons-material/FileUpload";

interface MediaLibraryDialogProps {
    open: boolean;
    onClose: () => void;
    onSelect: (paths: string[]) => void;
    alreadySelected: string[];
}

const MediaLibraryDialog = ({ open, onClose, onSelect, alreadySelected }: MediaLibraryDialogProps) => {
    const [allImages, setAllImages] = useState<MediaImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const [categoryTab, setCategoryTab] = useState("All");

    const loadImages = () => {
        setLoading(true);
        setSelected([]);
        fetchMediaLibrary()
            .then(setAllImages)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (!open) return;
        loadImages();
    }, [open]);

    const categories = ["All", ...Array.from(new Set(allImages.map((img) => img.category)))];
    const productCategories = categories.filter((c) => c !== "All" && c !== "Banners" && c !== "Categories");

    const filteredImages = categoryTab === "All"
        ? allImages
        : allImages.filter((img) => img.category === categoryTab);

    const toggleImage = (imagePath: string) => {
        setSelected((prev) => {
            if (prev.includes(imagePath)) {
                return prev.filter((p) => p !== imagePath);
            }
            return [...prev, imagePath];
        });
    };

    const isAlreadyUsed = (imagePath: string) => {
        return alreadySelected.includes(imagePath);
    };

    const handleConfirm = () => {
        onSelect(selected);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const targetCategory = categoryTab !== "All" && categoryTab !== "Banners" && categoryTab !== "Categories"
            ? categoryTab
            : productCategories[0] || "Women";

        setUploading(true);
        try {
            await uploadMediaImages(Array.from(files), targetCategory);
            loadImages();
        } finally {
            setUploading(false);
        }
        e.target.value = "";
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box component="span" sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 500 }}>Media Library</Box>
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                            <Tabs
                                value={categoryTab}
                                onChange={(_, value) => setCategoryTab(value)}
                                sx={{ "& .MuiTab-root": { textTransform: "none" } }}
                            >
                                {categories.map((cat) => (
                                    <Tab key={cat} value={cat} label={cat} />
                                ))}
                            </Tabs>
                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={uploading ? <CircularProgress size={16} /> : <FileUploadIcon />}
                                disabled={uploading}
                                sx={{ textTransform: "none", borderColor: "#ddd", color: "#000", whiteSpace: "nowrap" }}
                            >
                                Upload Images
                                <input type="file" hidden multiple accept="image/*" onChange={handleUpload} />
                            </Button>
                        </Box>

                        <Typography variant="body2" color="text.secondary" mb={2}>
                            {selected.length} image{selected.length !== 1 ? "s" : ""} selected
                            {categoryTab !== "All" && categoryTab !== "Banners" && categoryTab !== "Categories" &&
                                ` • Uploading to: ${categoryTab}`}
                        </Typography>

                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1.5, maxHeight: 400, overflowY: "auto" }}>
                            {filteredImages.map((img) => {
                                const isUsed = isAlreadyUsed(img.path);
                                const isSelected = selected.includes(img.path);

                                return (
                                    <Box
                                        key={img.path}
                                        onClick={() => {
                                            if (!isUsed) toggleImage(img.path);
                                        }}
                                        sx={{
                                            position: "relative",
                                            cursor: isUsed ? "default" : "pointer",
                                            opacity: isUsed ? 0.4 : 1,
                                            border: isSelected ? "3px solid #c8a951" : "2px solid transparent",
                                            borderRadius: 1,
                                            overflow: "hidden",
                                            "&:hover": isUsed ? {} : { border: "2px solid #ccc" },
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={getImageUrl(img.path)}
                                            alt={img.filename}
                                            sx={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}
                                        />
                                        {isSelected && (
                                            <CheckCircleIcon
                                                sx={{
                                                    position: "absolute", top: 4, right: 4,
                                                    color: "#c8a951", bgcolor: "#fff", borderRadius: "50%", fontSize: 22,
                                                }}
                                            />
                                        )}
                                        {isUsed && (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    position: "absolute", bottom: 0, left: 0, right: 0,
                                                    bgcolor: "rgba(0,0,0,0.6)", color: "#fff", textAlign: "center", py: 0.3,
                                                }}
                                            >
                                                Already used
                                            </Typography>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={onClose} variant="outlined" sx={{ flex: 1, textTransform: "none", borderColor: "#ddd", color: "#000" }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={selected.length === 0}
                    sx={{ flex: 1, textTransform: "none", bgcolor: "#c8a951", "&:hover": { bgcolor: "#b09540" } }}
                >
                    Add {selected.length} Image{selected.length !== 1 ? "s" : ""}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MediaLibraryDialog;
