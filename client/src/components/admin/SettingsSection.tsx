import { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tabs, Tab, TextField, InputAdornment } from "@mui/material";
import { fetchMediaLibrary, replaceBanner, toggleNewArrival, uploadMediaImages, fetchAllProducts } from "../../services/admin-api";
import { fetchNewArrivals } from "../../services/products-api";
import type { ProductFromServer } from "../../services/products-api";
import type { MediaImage } from "../../services/admin-api";
import { getImageUrl } from "../../utils/format";
import StarIcon from "@mui/icons-material/Star";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SearchIcon from "@mui/icons-material/Search";

interface SiteImage {
    label: string;
    path: string;
    usedIn: string;
}

const siteImages: SiteImage[] = [
    { label: "Hero Banner", path: "/public/images/hero/hero-image.jpg", usedIn: "Home Page — Hero Section" },
    { label: "Auth Page Background", path: "/public/images/hero/auth-image.jpg", usedIn: "Login / Register Page" },
    { label: "Women Category", path: "/public/images/categories/category-women.jpg", usedIn: "Home Page — Categories" },
    { label: "Men Category", path: "/public/images/categories/category-men.jpg", usedIn: "Home Page — Categories" },
    { label: "Accessories Category", path: "/public/images/categories/category-accessories.jpg", usedIn: "Home Page — Categories" },
];

const SettingsSection = () => {
    const [mediaImages, setMediaImages] = useState<MediaImage[]>([]);
    const [homepageArrivals, setHomepageArrivals] = useState<ProductFromServer[]>([]);
    const [loading, setLoading] = useState(true);
    const [bannerPickerTarget, setBannerPickerTarget] = useState<SiteImage | null>(null);
    const [bannerVersion, setBannerVersion] = useState(0);
    const [replaceTarget, setReplaceTarget] = useState<ProductFromServer | null>(null);

    const loadData = () => {
        setLoading(true);
        Promise.all([
            fetchMediaLibrary(),
            fetchNewArrivals(4),
        ])
            .then(([media, arrivals]) => {
                setMediaImages(media);
                setHomepageArrivals(arrivals);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleBannerReplace = async (sourcePath: string) => {
        if (!bannerPickerTarget) return;
        await replaceBanner(bannerPickerTarget.path, sourcePath);
        setBannerPickerTarget(null);
        setBannerVersion((v) => v + 1);
    };

    const handleRemoveFromFeatured = async (productId: string) => {
        await toggleNewArrival(productId);
        const freshArrivals = await fetchNewArrivals(4);
        setHomepageArrivals(freshArrivals);
    };

    const handleReplaceFeatured = async (newProductId: string) => {
        if (!replaceTarget) return;
        if (replaceTarget.isFeaturedNewArrival) {
            await toggleNewArrival(replaceTarget._id);
        }
        await toggleNewArrival(newProductId);
        const freshArrivals = await fetchNewArrivals(4);
        setHomepageArrivals(freshArrivals);
        setReplaceTarget(null);
    };

    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploading(true);
        try {
            await uploadMediaImages(Array.from(files), "Women");
            loadData();
        } finally {
            setUploading(false);
        }
        e.target.value = "";
    };

    if (loading) return <CircularProgress />;

    const mediaCounts: Record<string, number> = {};
    for (const img of mediaImages) {
        mediaCounts[img.category] = (mediaCounts[img.category] || 0) + 1;
    }

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={1}>Settings</Typography>
            <Typography color="text.secondary" mb={3}>Content management and site configuration</Typography>

            {/* Site Banners */}
            <Typography variant="h6" fontWeight="bold" mb={2}>Site Banners</Typography>
            <Paper sx={{ p: 3, mb: 4, border: "1px solid #eee" }} elevation={0}>
                <Typography color="text.secondary" variant="body2" mb={2}>
                    Click "Replace" to swap a banner with any image from the media library.
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 2 }}>
                    {siteImages.map((img) => (
                        <Box key={img.path} sx={{ border: "1px solid #eee", borderRadius: 1, overflow: "hidden" }}>
                            <Box
                                component="img"
                                src={getImageUrl(img.path) + `?v=${bannerVersion}`}
                                alt={img.label}
                                sx={{ width: "100%", height: 140, objectFit: "cover" }}
                            />
                            <Box sx={{ p: 1.5 }}>
                                <Typography variant="body2" fontWeight={600}>{img.label}</Typography>
                                <Typography variant="caption" color="text.secondary">{img.usedIn}</Typography>
                                <Button
                                    size="small"
                                    startIcon={<SwapHorizIcon />}
                                    onClick={() => setBannerPickerTarget(img)}
                                    sx={{ mt: 1, textTransform: "none", color: "#c8a951", display: "block" }}
                                >
                                    Replace
                                </Button>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Paper>

            {/* Media Library Overview */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">Media Library</Typography>
                <Button
                    component="label"
                    variant="outlined"
                    startIcon={uploading ? <CircularProgress size={16} /> : <FileUploadIcon />}
                    disabled={uploading}
                    sx={{ textTransform: "none", borderColor: "#ddd", color: "#000" }}
                >
                    Upload Images
                    <input type="file" hidden multiple accept="image/*" onChange={handleUpload} />
                </Button>
            </Box>
            <Paper sx={{ p: 3, mb: 4, border: "1px solid #eee" }} elevation={0}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        {mediaImages.length} images available
                    </Typography>
                    {Object.entries(mediaCounts).map(([cat, count]) => (
                        <Chip key={cat} label={`${cat}: ${count}`} size="small" variant="outlined" />
                    ))}
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 1 }}>
                    {mediaImages.slice(0, 16).map((img) => (
                        <Box
                            key={img.path}
                            component="img"
                            src={getImageUrl(img.path)}
                            alt={img.filename}
                            sx={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 1 }}
                        />
                    ))}
                    {mediaImages.length > 16 && (
                        <Box sx={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            bgcolor: "#f5f5f5", borderRadius: 1, aspectRatio: "1",
                        }}>
                            <Typography variant="body2" color="text.secondary">
                                +{mediaImages.length - 16}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* New Arrivals — shows the actual 4 from homepage */}
            <Typography variant="h6" fontWeight="bold" mb={2}>
                <StarIcon sx={{ fontSize: 20, mr: 1, verticalAlign: "text-bottom", color: "#c8a951" }} />
                Homepage New Arrivals (4 shown)
            </Typography>
            <Paper sx={{ p: 3, border: "1px solid #eee" }} elevation={0}>
                <Typography color="text.secondary" variant="body2" mb={2}>
                    These are the 4 products currently shown on the homepage. Manually selected products appear first, remaining slots are filled with the newest products.
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
                    {homepageArrivals.map((product) => (
                        <Paper key={product._id} sx={{ border: "1px solid #eee", overflow: "hidden" }} elevation={0}>
                            <Box
                                component="img"
                                src={getImageUrl(product.images[0] || "")}
                                alt={product.name}
                                sx={{ width: "100%", height: 160, objectFit: "cover" }}
                            />
                            <Box sx={{ p: 1.5 }}>
                                <Typography variant="body2" fontWeight={500} noWrap>{product.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{"$"}{product.price}</Typography>
                                <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                                    {product.isFeaturedNewArrival ? (
                                        <Chip
                                            icon={<StarIcon sx={{ fontSize: 14 }} />}
                                            label="Manually selected"
                                            size="small"
                                            sx={{ bgcolor: "#c8a951", color: "#fff", "& .MuiChip-icon": { color: "#fff" } }}
                                        />
                                    ) : (
                                        <Chip
                                            icon={<StarBorderIcon sx={{ fontSize: 14 }} />}
                                            label="Auto-filled"
                                            size="small"
                                            variant="outlined"
                                        />
                                    )}
                                </Box>
                                <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                                    <Button
                                        size="small"
                                        startIcon={<SwapHorizIcon />}
                                        onClick={() => setReplaceTarget(product)}
                                        sx={{ textTransform: "none", color: "#c8a951" }}
                                    >
                                        Replace
                                    </Button>
                                    {product.isFeaturedNewArrival && (
                                        <Button
                                            size="small"
                                            onClick={() => handleRemoveFromFeatured(product._id)}
                                            sx={{ textTransform: "none", color: "#d32f2f" }}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            </Paper>

            {/* Banner Picker Dialog */}
            <BannerPickerDialog
                open={!!bannerPickerTarget}
                bannerLabel={bannerPickerTarget?.label || ""}
                images={mediaImages}
                onClose={() => setBannerPickerTarget(null)}
                onSelect={handleBannerReplace}
                onRefresh={loadData}
            />

            {/* Product Picker Dialog */}
            <ProductPickerDialog
                open={!!replaceTarget}
                replacingLabel={replaceTarget?.name || ""}
                onClose={() => setReplaceTarget(null)}
                onSelect={handleReplaceFeatured}
                currentFeaturedIds={homepageArrivals.filter((p) => p.isFeaturedNewArrival).map((p) => p._id)}
            />
        </Box>
    );
};

/* ---- Banner Picker Dialog ---- */

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

/* ---- Product Picker Dialog (single select) ---- */

interface ProductPickerDialogProps {
    open: boolean;
    replacingLabel: string;
    onClose: () => void;
    onSelect: (productId: string) => void;
    currentFeaturedIds: string[];
}

const ProductPickerDialog = ({ open, replacingLabel, onClose, onSelect, currentFeaturedIds }: ProductPickerDialogProps) => {
    const [products, setProducts] = useState<ProductFromServer[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 12;

    useEffect(() => {
        if (open) {
            setSearch("");
            setSelected("");
            setPage(1);
            loadProducts(1);
        }
    }, [open]);

    const loadProducts = async (pageNum: number) => {
        setLoading(true);
        try {
            const result = await fetchAllProducts({ page: pageNum, limit, sort: "newest" });
            setProducts(result.data);
            setTotal(result.total);
            setPage(pageNum);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = search
        ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
        : products;

    const totalPages = Math.ceil(total / limit);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box component="span" sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 500 }}>
                    Replace: {replacingLabel}
                </Box>
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                        ),
                    }}
                />

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, maxHeight: 450, overflowY: "auto" }}>
                        {filteredProducts.map((product) => {
                            const isSelected = selected === product._id;
                            const isAlreadyFeatured = currentFeaturedIds.includes(product._id);
                            return (
                                <Box
                                    key={product._id}
                                    onClick={() => {
                                        if (!isAlreadyFeatured) {
                                            setSelected(product._id);
                                        }
                                    }}
                                    sx={{
                                        position: "relative",
                                        cursor: isAlreadyFeatured ? "default" : "pointer",
                                        border: isSelected ? "3px solid #c8a951" : "2px solid transparent",
                                        borderRadius: 1,
                                        overflow: "hidden",
                                        opacity: isAlreadyFeatured ? 0.5 : 1,
                                        "&:hover": isAlreadyFeatured ? {} : { border: "2px solid #ccc" },
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={getImageUrl(product.images[0] || "")}
                                        alt={product.name}
                                        sx={{ width: "100%", height: 130, objectFit: "cover", display: "block" }}
                                    />
                                    {isSelected && (
                                        <CheckCircleIcon
                                            sx={{
                                                position: "absolute", top: 4, right: 4,
                                                color: "#c8a951", bgcolor: "#fff", borderRadius: "50%", fontSize: 22,
                                            }}
                                        />
                                    )}
                                    <Box sx={{ p: 1 }}>
                                        <Typography variant="body2" fontWeight={500} noWrap>{product.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{"$"}{product.price}</Typography>
                                        {isAlreadyFeatured && (
                                            <Typography variant="caption" display="block" color="text.secondary">Already featured</Typography>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                )}

                {totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
                        <Button
                            size="small"
                            disabled={page <= 1}
                            onClick={() => loadProducts(page - 1)}
                            sx={{ textTransform: "none" }}
                        >
                            Previous
                        </Button>
                        <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
                            {page} / {totalPages}
                        </Typography>
                        <Button
                            size="small"
                            disabled={page >= totalPages}
                            onClick={() => loadProducts(page + 1)}
                            sx={{ textTransform: "none" }}
                        >
                            Next
                        </Button>
                    </Box>
                )}
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
                    Replace
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SettingsSection;
