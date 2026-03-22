import { useEffect, useState } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TextField } from "@mui/material";
import type { ProductFromServer } from "../../services/products-api";
import { getImageUrl } from "../../utils/format";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import MediaLibraryDialog from "./MediaLibraryDialog";

interface ProductEditDialogProps {
    product: ProductFromServer | null;
    onClose: () => void;
    onSave: (updates: Partial<ProductFromServer>) => void;
}

const ProductEditDialog = ({ product, onClose, onSave }: ProductEditDialogProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [salePrice, setSalePrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [type, setType] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
            setSalePrice(product.salePrice || 0);
            setStock(product.stock);
            setType(product.type);
            setImages([...product.images]);
        }
    }, [product]);

    if (!product) return null;

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
            images,
        });
    };

    return (
        <>
            <Dialog open={!!product} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box component="span" sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 500 }}>Edit Product</Box>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField label="Product Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                            <TextField label="Price ($)" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} fullWidth />
                            <TextField label="Sale Price ($)" type="number" value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value))} fullWidth helperText="Set to 0 for no sale" />
                            <TextField label="Stock Quantity" type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} fullWidth />
                            <TextField label="Type" value={type} onChange={(e) => setType(e.target.value)} fullWidth />
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={4} />
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
                                            alt={`${product.name} ${i + 1}`}
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
                    <Button onClick={handleSubmit} variant="contained" sx={{ flex: 1, textTransform: "none", bgcolor: "#c8a951", "&:hover": { bgcolor: "#b09540" } }}>
                        Save Changes
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

export default ProductEditDialog;
