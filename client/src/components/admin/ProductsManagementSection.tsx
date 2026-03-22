import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Pagination, IconButton, Select, MenuItem } from "@mui/material";
import { fetchAllProducts, updateProduct, deleteProduct, createProduct } from "../../services/admin-api";
import type { ProductFromServer } from "../../services/products-api";
import { getImageUrl } from "../../utils/format";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ProductEditDialog from "./ProductEditDialog";
import ProductAddDialog from "./ProductAddDialog";

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

export default ProductsManagementSection;