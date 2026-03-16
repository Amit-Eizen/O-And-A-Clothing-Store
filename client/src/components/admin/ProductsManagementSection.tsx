import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Pagination, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab, Select, MenuItem } from "@mui/material";
import { fetchAllProducts, updateProduct, deleteProduct, createProduct, fetchMediaLibrary, uploadMediaImages } from "../../services/admin-api";
import type { ProductFromServer } from "../../services/products-api";
import type { MediaImage } from "../../services/admin-api";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { getImageUrl } from "../../utils/format";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "name-asc", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "stock-asc", label: "Stock: Low to High" },
    { value: "stock-desc", label: "Stock: High to Low" },
];

const ProductsManagementSection = () => {
    const [products, setProducts] = useState<ProductFromServer[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [sort, setSort] = useState("newest");
    const [editProduct, setEditProduct] = useState<ProductFromServer | null>(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const limit = 10;

    const loadProducts = () => {
        setLoading(true);
        fetchAllProducts({ page, limit, sort })
            .then((res) => {
                setProducts(res.data);
                setTotal(res.total);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadProducts();
    }, [page, sort]);

    const handleToggleNewTag = async (product: ProductFromServer) => {
        const hasNewTag = product.tags.some((t) => t.toLowerCase() === "new");
        const updatedTags = hasNewTag
            ? product.tags.filter((t) => t.toLowerCase() !== "new")
            : [...product.tags, "new"];

        const updated = await updateProduct(product._id, { tags: updatedTags });
        setProducts((prev) =>
            prev.map((p) => {
                if (p._id === product._id) {
                    return { ...p, tags: updated.tags };
                }
                return p;
            })
        );
    };

    const handleDelete = async (productId: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        await deleteProduct(productId);
        loadProducts();
    };

    const handleEditSave = async (updates: Partial<ProductFromServer>) => {
        if (!editProduct) return;
        const updated = await updateProduct(editProduct._id, updates);
        setProducts((prev) =>
            prev.map((p) => {
                if (p._id === editProduct._id) {
                    return { ...p, ...updated };
                }
                return p;
            })
        );
        setEditProduct(null);
    };

    const handleCreateProduct = async (data: Partial<ProductFromServer>) => {
        await createProduct(data);
        setAddDialogOpen(false);
        setPage(1);
        loadProducts();
    };

    const totalPages = Math.ceil(total / limit);

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" mb={1}>Products Management</Typography>
                    <Typography color="text.secondary">Manage your product catalog and inventory</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddDialogOpen(true)}
                    sx={{ textTransform: "none", bgcolor: "#c8a951", "&:hover": { bgcolor: "#b09540" } }}
                >
                    Add Product
                </Button>
            </Box>

            {/* Sort Bar */}
            <Paper sx={{ p: 2, mb: 3, border: "1px solid #eee", display: "flex", alignItems: "center", gap: 2 }} elevation={0}>
                <Typography color="text.secondary">Sort by:</Typography>
                <Select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value); setPage(1); }}
                    size="small"
                    sx={{ minWidth: 180 }}
                >
                    {sortOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                </Select>
                <Typography color="text.secondary" sx={{ ml: "auto" }}>
                    {total} product{total !== 1 ? "s" : ""}
                </Typography>
            </Paper>

            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #eee" }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "#fafafa" }}>
                            <TableCell sx={{ fontWeight: 700 }}>PRODUCT</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>TYPE</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>PRICE</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>STOCK</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>NEW</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product._id} hover>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <Box
                                            component="img"
                                            src={getImageUrl(product.images[0] || "")}
                                            alt={product.name}
                                            sx={{ width: 50, height: 50, objectFit: "cover", borderRadius: 1 }}
                                        />
                                        <Typography variant="body2" fontWeight={500}>{product.name}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">{product.type}</Typography>
                                </TableCell>
                                <TableCell>
                                    {product.salePrice ? (
                                        <>
                                            <Typography component="span" sx={{ textDecoration: "line-through", color: "text.secondary", mr: 1 }} variant="body2">
                                                {"$"}{product.price}
                                            </Typography>
                                            <Typography component="span" color="error" variant="body2">
                                                {"$"}{product.salePrice}
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography variant="body2">{"$"}{product.price}</Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: product.stock <= 5 ? "#d32f2f" : "#c8a951", fontWeight: 600 }}
                                    >
                                        {product.stock}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant={product.tags.some((t) => t.toLowerCase() === "new") ? "contained" : "outlined"}
                                        size="small"
                                        onClick={() => handleToggleNewTag(product)}
                                        sx={{
                                            textTransform: "none",
                                            bgcolor: product.tags.some((t) => t.toLowerCase() === "new") ? "#000" : "transparent",
                                            color: product.tags.some((t) => t.toLowerCase() === "new") ? "#fff" : "#000",
                                            borderColor: "#ddd",
                                            "&:hover": {
                                                bgcolor: product.tags.some((t) => t.toLowerCase() === "new") ? "#333" : "#f5f5f5",
                                                borderColor: "#ddd",
                                            },
                                        }}
                                    >
                                        {product.tags.some((t) => t.toLowerCase() === "new") ? "NEW" : "Mark as New"}
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <IconButton size="small" onClick={() => setEditProduct(product)}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDelete(product._id)} sx={{ color: "text.secondary" }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} />
                </Box>
            )}

            {/* Edit Dialog */}
            <ProductEditDialog
                product={editProduct}
                onClose={() => setEditProduct(null)}
                onSave={handleEditSave}
            />

            {/* Add Product Dialog */}
            <ProductAddDialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                onSave={handleCreateProduct}
            />
        </Box>
    );
};

/* ---- Product Edit Dialog ---- */

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
                    <ProductFormFields
                        name={name} setName={setName}
                        description={description} setDescription={setDescription}
                        price={price} setPrice={setPrice}
                        salePrice={salePrice} setSalePrice={setSalePrice}
                        stock={stock} setStock={setStock}
                        type={type} setType={setType}
                        images={images}
                        onRemoveImage={handleRemoveImage}
                        onOpenLibrary={() => setMediaLibraryOpen(true)}
                        productName={product.name}
                    />
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

/* ---- Product Add Dialog ---- */

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
                        {/* Left Column */}
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
                        {/* Right Column */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={3} required />
                            <TextField label="Sizes" value={sizes} onChange={(e) => setSizes(e.target.value)} fullWidth helperText="Comma separated: S, M, L, XL" />
                            <TextField label="Colors" value={colors} onChange={(e) => setColors(e.target.value)} fullWidth helperText="Comma separated: Black, White, Red" />

                            {/* Images Management */}
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

/* ---- Shared Form Fields (used by Edit dialog) ---- */

interface ProductFormFieldsProps {
    name: string; setName: (v: string) => void;
    description: string; setDescription: (v: string) => void;
    price: number; setPrice: (v: number) => void;
    salePrice: number; setSalePrice: (v: number) => void;
    stock: number; setStock: (v: number) => void;
    type: string; setType: (v: string) => void;
    images: string[];
    onRemoveImage: (index: number) => void;
    onOpenLibrary: () => void;
    productName: string;
}

const ProductFormFields = ({
    name, setName, description, setDescription,
    price, setPrice, salePrice, setSalePrice,
    stock, setStock, type, setType,
    images, onRemoveImage, onOpenLibrary, productName,
}: ProductFormFieldsProps) => (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
        {/* Left Column */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Product Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            <TextField label="Price ($)" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} fullWidth />
            <TextField label="Sale Price ($)" type="number" value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value))} fullWidth helperText="Set to 0 for no sale" />
            <TextField label="Stock Quantity" type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} fullWidth />
            <TextField label="Type" value={type} onChange={(e) => setType(e.target.value)} fullWidth />
        </Box>
        {/* Right Column */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={4} />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle2" fontWeight={600}>Images</Typography>
                <Button
                    size="small"
                    startIcon={<AddPhotoAlternateIcon />}
                    onClick={onOpenLibrary}
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
                            alt={`${productName} ${i + 1}`}
                            sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1, border: "1px solid #eee" }}
                        />
                        <IconButton
                            size="small"
                            onClick={() => onRemoveImage(i)}
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
);

/* ---- Media Library Dialog ---- */

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

export default ProductsManagementSection;
