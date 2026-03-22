import { useEffect, useState } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tabs, Tab, TextField, InputAdornment, CircularProgress } from "@mui/material";
import { fetchAllProducts } from "../../services/admin-api";
import { fetchFilteredProducts } from "../../services/products-api";
import type { ProductFromServer } from "../../services/products-api";
import { getImageUrl } from "../../utils/format";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";

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
    const [tab, setTab] = useState<"new" | "all">("new");
    const limit = 12;

    useEffect(() => {
        if (open) {
            setSearch("");
            setSelected("");
            setPage(1);
            setTab("new");
            loadProducts(1, "new");
        }
    }, [open]);

    const loadProducts = async (pageNum: number, filterTab?: "new" | "all") => {
        setLoading(true);
        try {
            const activeTab = filterTab || tab;
            if (activeTab === "new") {
                const result = await fetchFilteredProducts({
                    newArrivals: true,
                    page: pageNum,
                    limit,
                    sort: "newest",
                });
                setProducts(result.products);
                setTotal(result.total);
            } else {
                const result = await fetchAllProducts({ page: pageNum, limit, sort: "newest" });
                setProducts(result.data);
                setTotal(result.total);
            }
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

                <Tabs
                    value={tab}
                    onChange={(_, value) => {
                        setTab(value);
                        setPage(1);
                        loadProducts(1, value);
                    }}
                    sx={{ mb: 2, "& .MuiTab-root": { textTransform: "none" } }}
                >
                    <Tab value="new" label="New Arrivals" />
                    <Tab value="all" label="All Products" />
                </Tabs>

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

export default ProductPickerDialog;
