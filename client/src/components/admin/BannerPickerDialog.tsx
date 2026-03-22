import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tabs, Tab, CircularProgress } from "@mui/material";
import { uploadMediaImages } from "../../services/admin-api";
import type { MediaImage } from "../../services/admin-api";
import { getImageUrl } from "../../utils/format";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FileUploadIcon from "@mui/icons-material/FileUpload";

interface BannerPickerDialogProps {
    open: boolean;
    bannerLabel: string;
    images: MediaImage[];
    onClose: () => void;
    onSelect: (sourcePath: string) => void;
    onRefresh: () => void;
}

const BannerPickerDialog = ({ open, bannerLabel, images, onClose, onSelect, onRefresh }: BannerPickerDialogProps) => {
    const [selected, setSelected] = useState("");
    const [categoryTab, setCategoryTab] = useState("All");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (open) {
            setSelected("");
            setCategoryTab("All");
        }
    }, [open]);

    const categories = ["All", ...Array.from(new Set(images.map((img) => img.category)))];

    const filteredImages = categoryTab === "All"
        ? images
        : images.filter((img) => img.category === categoryTab);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploading(true);
        try {
            await uploadMediaImages(Array.from(files), "Women");
            onRefresh();
        } finally {
            setUploading(false);
        }
        e.target.value = "";
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box component="span" sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 500 }}>
                    Replace: {bannerLabel}
                </Box>
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
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
                        Upload
                        <input type="file" hidden multiple accept="image/*" onChange={handleUpload} />
                    </Button>
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1.5, maxHeight: 400, overflowY: "auto" }}>
                    {filteredImages.map((img) => {
                        const isSelected = selected === img.path;
                        return (
                            <Box
                                key={img.path}
                                onClick={() => setSelected(img.path)}
                                sx={{
                                    position: "relative",
                                    cursor: "pointer",
                                    border: isSelected ? "3px solid #c8a951" : "2px solid transparent",
                                    borderRadius: 1,
                                    overflow: "hidden",
                                    "&:hover": { border: "2px solid #ccc" },
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
                            </Box>
                        );
                    })}
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={onClose} variant="outlined" sx={{ flex: 1, textTransform: "none", borderColor: "#ddd", color: "#000" }}>
                    Cancel
                </Button>
                <Button
                    onClick={() => onSelect(selected)}
                    variant="contained"
                    disabled={!selected}
                    sx={{ flex: 1, textTransform: "none", bgcolor: "#c8a951", "&:hover": { bgcolor: "#b09540" } }}
                >
                    Replace Banner
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BannerPickerDialog;
