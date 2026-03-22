import { useEffect, useState } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TextField, Select, MenuItem } from "@mui/material";
import type { ProductFromServer } from "../../services/products-api";
import { getImageUrl } from "../../utils/format";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import MediaLibraryDialog from "./MediaLibraryDialog";

interface ProductAddDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: Partial<ProductFromServer>) => void;
}

const ProductAddDialog = ({ open, onClose, onSave }: ProductAddDialogProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [salePrice, setSalePrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [type, setType] = useState("");
    const [category, setCategory] = useState<"men" | "women" | "accessories">("women");
    const [images, setImages] = useState<string[]>([]);
    const [sizes, setSizes] = useState("");
    const [colors, setColors] = useState("");
    const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);

    useEffect(() => {
        if (open) {
            setName("");
            setDescription("");
            setPrice(0);
            setSalePrice(0);
            setStock(0);
            setType("");
            setCategory("women");
            setImages([]);
            setSizes("");
            setColors("");
        }
    }, [open]);

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddFromLibrary = (selectedPaths: string[]) => {
        setImages((prev) => [...prev, ...selectedPaths]);
        setMediaLibraryOpen(false);
    };

    const handleSubmit = () => {
        onSave({
            name,
            description,
            price,
            salePrice: salePrice || undefined,
            stock,
            type,
            category,
            images,
            sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
            colors: colors.split(",").map((c) => c.trim()).filter(Boolean),
        });
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box component="span" sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 500 }}>Add New Product</Box>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField label="Product Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
                            <TextField label="Type" value={type} onChange={(e) => setType(e.target.value)} fullWidth required placeholder="e.g. Dresses, T-Shirts, Bags" />
                            <TextField label="Price ($)" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} fullWidth required />
                            <TextField label="Sale Price ($)" type="number" value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value))} fullWidth helperText="Set to 0 for no sale" />
                            <TextField label="Stock Quantity" type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} fullWidth required />
                            <Box>
                                <Typography variant="subtitle2" fontWeight={600} mb={1}>Category</Typography>
                                <Select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as "men" | "women" | "accessories")}
                                    fullWidth
                                    size="small"
                                >
                                    <MenuItem value="women">Women</MenuItem>
                                    <MenuItem value="men">Men</MenuItem>
                                    <MenuItem value="accessories">Accessories</MenuItem>
                                </Select>
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={3} required />
                            <TextField label="Sizes" value={sizes} onChange={(e) => setSizes(e.target.value)} fullWidth helperText="Comma separated: S, M, L, XL" />
                            <TextField label="Colors" value={colors} onChange={(e) => setColors(e.target.value)} fullWidth helperText="Comma separated: Black, White, Red" />

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="subtitle2" fontWeight={600}>Images</Typography>
                                <Button
                                    size="small"
                                    startIcon={<AddPhotoAlternateIcon />}
                                    onClick={() => setMediaLibraryOpen(true)}
                                    sx={{ textTransform: "none", color: "#c8a951" }}
                                >
                                    Add from Library
                                </Button>
                            </Box>
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                {images.map((img, i) => (
                                    <Box key={i} sx={{ position: "relative" }}>
                                        <Box
                                            component="img"
                                            src={getImageUrl(img)}
                                            alt={`New product ${i + 1}`}
                                            sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1, border: "1px solid #eee" }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveImage(i)}
                                            sx={{
                                                position: "absolute", top: -8, right: -8,
                                                bgcolor: "#d32f2f", color: "#fff", width: 20, height: 20,
                                                "&:hover": { bgcolor: "#b71c1c" },
                                            }}
                                        >
                                            <CloseIcon sx={{ fontSize: 14 }} />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={onClose} variant="outlined" sx={{ flex: 1, textTransform: "none", borderColor: "#ddd", color: "#000" }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!name || !type || !description || !price || !stock}
                        sx={{ flex: 1, textTransform: "none", bgcolor: "#c8a951", "&:hover": { bgcolor: "#b09540" } }}
                    >
                        Create Product
                    </Button>
                </DialogActions>
            </Dialog>

            <MediaLibraryDialog
                open={mediaLibraryOpen}
                onClose={() => setMediaLibraryOpen(false)}
                onSelect={handleAddFromLibrary}
                alreadySelected={images}
            />
        </>
    );
};

export default ProductAddDialog;
