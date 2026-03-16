import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Pagination, Button, Dialog, DialogTitle, DialogContent, IconButton, Divider } from "@mui/material";
import { fetchAllOrders, updateOrderStatus } from "../../services/admin-api";
import type { OrderFromServer } from "../../services/admin-api";
import statusColors from "../../utils/orderStatusColors";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import InventoryIcon from "@mui/icons-material/Inventory";

const statusOptions = ["", "pending", "processing", "shipped", "delivered", "cancelled"];
const statusLabels = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const OrdersManagementSection = () => {
    const [orders, setOrders] = useState<OrderFromServer[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<OrderFromServer | null>(null);
    const limit = 10;

    useEffect(() => {
        setLoading(true);
        const params: { page: number; limit: number; status?: string } = { page, limit };
        if (statusFilter) {
            params.status = statusFilter;
        }

        fetchAllOrders(params)
            .then((res) => {
                setOrders(res.data);
                setTotal(res.total);
            })
            .finally(() => setLoading(false));
    }, [page, statusFilter]);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        const updated = await updateOrderStatus(orderId, newStatus);
        setOrders((prev) =>
            prev.map((o) => {
                if (o._id === orderId) {
                    return { ...o, status: updated.status };
                }
                return o;
            })
        );
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={1}>Orders Management</Typography>
            <Typography color="text.secondary" mb={3}>Manage and track all customer orders</Typography>

            {/* Filter Buttons */}
            <Paper sx={{ p: 2, mb: 3, border: "1px solid #eee" }} elevation={0}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography color="text.secondary" mr={1}>Filter by Status:</Typography>
                    {statusOptions.map((status, index) => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? "contained" : "outlined"}
                            size="small"
                            onClick={() => { setStatusFilter(status); setPage(1); }}
                            sx={{
                                textTransform: "none",
                                borderColor: "#ddd",
                                color: statusFilter === status ? "#fff" : "#000",
                                bgcolor: statusFilter === status ? "#000" : "transparent",
                                "&:hover": { bgcolor: statusFilter === status ? "#333" : "#f5f5f5", borderColor: "#ddd" },
                            }}
                        >
                            {statusLabels[index]}
                        </Button>
                    ))}
                </Box>
            </Paper>

            {loading ? <CircularProgress /> : (
                <>
                    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #eee" }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: "#fafafa" }}>
                                    <TableCell sx={{ fontWeight: 700 }}>ORDER #</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>CUSTOMER</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>DATE</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>TOTAL</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>STATUS</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>ACTIONS</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order._id} hover>
                                        <TableCell>{order.orderNumber || order._id.slice(-6)}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={500}>{order.userId?.username || "Unknown"}</Typography>
                                            <Typography variant="caption" color="text.secondary">{order.userId?.email}</Typography>
                                        </TableCell>
                                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>
                                                {"$"}
                                                {order.totalPrice.toFixed(2)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                size="small"
                                                sx={{
                                                    minWidth: 130,
                                                    "& .MuiSelect-select": {
                                                        color: statusColors[order.status] === "success" ? "#2e7d32"
                                                            : statusColors[order.status] === "error" ? "#d32f2f"
                                                            : statusColors[order.status] === "warning" ? "#ed6c02"
                                                            : statusColors[order.status] === "info" ? "#0288d1"
                                                            : "#1976d2",
                                                        fontWeight: 500,
                                                    },
                                                }}
                                            >
                                                <MenuItem value="pending">Pending</MenuItem>
                                                <MenuItem value="processing">Processing</MenuItem>
                                                <MenuItem value="shipped">Shipped</MenuItem>
                                                <MenuItem value="delivered">Delivered</MenuItem>
                                                <MenuItem value="cancelled">Cancelled</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="small"
                                                startIcon={<VisibilityIcon />}
                                                onClick={() => setSelectedOrder(order)}
                                                sx={{ textTransform: "none", color: "#000" }}
                                            >
                                                View
                                            </Button>
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
                </>
            )}

            {/* Order Detail Dialog */}
            <OrderDetailDialog order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </Box>
    );
};

/* ---- Order Detail Dialog ---- */

interface OrderDetailDialogProps {
    order: OrderFromServer | null;
    onClose: () => void;
}

const OrderDetailDialog = ({ order, onClose }: OrderDetailDialogProps) => {
    if (!order) return null;

    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <Dialog open={!!order} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box component="span" sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 500 }}>{order.orderNumber || order._id.slice(-6)}</Box>
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {/* Status + Date */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">STATUS</Typography>
                        <Typography fontWeight={600} sx={{ color: statusColors[order.status] === "success" ? "#2e7d32" : statusColors[order.status] === "error" ? "#d32f2f" : "#1976d2" }}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">ORDER DATE</Typography>
                        <Typography fontWeight={600}>{new Date(order.createdAt).toLocaleString()}</Typography>
                    </Box>
                </Box>

                {/* Customer Info */}
                <Typography fontWeight="bold" mb={1}>Customer Information</Typography>
                <Paper sx={{ p: 2, mb: 3, bgcolor: "#fafafa" }} elevation={0}>
                    <Typography variant="body2"><b>Name:</b> {order.userId?.username || "Unknown"}</Typography>
                    <Typography variant="body2"><b>Email:</b> {order.userId?.email || "N/A"}</Typography>
                </Paper>

                {/* Shipping Address */}
                {order.shippingAddress && (
                    <>
                        <Typography fontWeight="bold" mb={1}>Shipping Address</Typography>
                        <Paper sx={{ p: 2, mb: 3, bgcolor: "#fafafa" }} elevation={0}>
                            <Typography variant="body2">{order.shippingAddress.street}</Typography>
                            <Typography variant="body2">{order.shippingAddress.city}, {order.shippingAddress.zipCode}</Typography>
                            <Typography variant="body2">{order.shippingAddress.country}</Typography>
                        </Paper>
                    </>
                )}

                {/* Order Items */}
                <Typography fontWeight="bold" mb={1}>Order Items</Typography>
                <Paper sx={{ p: 2, mb: 3, bgcolor: "#fafafa" }} elevation={0}>
                    {order.items.map((item, index) => (
                        <Box key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1, borderBottom: index < order.items.length - 1 ? "1px solid #eee" : "none" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <InventoryIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                                <Box>
                                    <Typography variant="body2" fontWeight={500}>{item.productId?.name || "Product"}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {item.color} / Size {item.size} x {item.quantity}
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography fontWeight={600}>{"$"}{(item.price * item.quantity).toFixed(2)}</Typography>
                        </Box>
                    ))}
                </Paper>

                {/* Totals */}
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography color="text.secondary">Subtotal</Typography>
                        <Typography>{"$"}{subtotal.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography color="text.secondary">Shipping</Typography>
                        <Typography>{"$"}{(order.shipping || 0).toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography color="text.secondary">Tax</Typography>
                        <Typography>{"$"}{(order.tax || 0).toFixed(2)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography fontWeight="bold">Total</Typography>
                        <Typography fontWeight="bold">{"$"}{order.totalPrice.toFixed(2)}</Typography>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default OrdersManagementSection;
