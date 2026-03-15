import { useEffect, useState } from "react";
import { Box, Typography, Chip, Button } from "@mui/material";
import apiClient from "../../services/api-client";
import { useNavigate } from "react-router-dom";
import WriteReviewDialog from "./WriteReviewDialog";
import { formatDate, getImageUrl } from "../../utils/format";

interface OrderItem {
    productId: {
        _id: string;
        name: string;
        images: string[];
        category: string;
    };
    quantity: number;
    size: string;
    color: string;
    price: number;
}

interface Order {
    _id: string;
    orderNumber: string;
    items: OrderItem[];
    totalPrice: number;
    shipping: number;
    status: "pending" | "shipped" | "delivered" | "cancelled";
    createdAt: string;
}

const statusColors: Record<string, "default" | "warning" | "info" | "success" | "error"> = {
    pending: "default",
    processing: "warning",
    shipped: "info",
    delivered: "success",
    cancelled: "error",
};

interface OrderHistorySectionProps {
    userId: string;
}

const OrderHistorySection = ({ userId }: OrderHistorySectionProps) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewDialog, setReviewDialog] = useState<{ productId: string; productName: string } | null>(null);
    const [reviewedProductIds, setReviewedProductIds] = useState<Set<string>>(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        apiClient.get("/orders")
            .then((res) => setOrders(res.data))
            .catch((err) => console.error("Failed to fetch orders:", err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        apiClient.get(`/reviews/user/${userId}`)
            .then((res) => {
                const ids = res.data.map((r: any) => r.productId._id);
                setReviewedProductIds(new Set(ids));
            })
            .catch(() => {});
    }, [userId]);

    if (loading) 
        return <Typography>Loading...</Typography>;

    if (orders.length === 0) {
        return (
            <Box>
                <Typography variant="h5" sx={{ mb: 1.5, fontFamily: "'Playfair Display', serif", fontSize: "1.75rem" }}>
                    Order History
                </Typography>
                <Typography color="text.secondary">
                    No orders yet.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 1.5, fontFamily: "'Playfair Display', serif", fontSize: "1.75rem" }}>
                Order History
            </Typography>
            <Typography sx={{ mb: 3 }} color="text.secondary">
                Track and manage your orders
            </Typography>
            

            {orders.map((order) => (
                <Box key={order._id} sx={{ border: "1px solid #e0e0e0", borderRadius: 2, mb: 3, overflow: "hidden" }}>
                    {/* Order Header */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#faf9f6", px: 3, py: 2 }}>
                        <Box>
                            <Typography fontWeight="bold">
                                Order #{order.orderNumber}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {formatDate(order.createdAt)}
                            </Typography>
                        </Box>
                        <Chip label={order.status.charAt(0).toUpperCase() + order.status.slice(1)} color={statusColors[order.status]} />
                    </Box>

                    {/* Order Items */}
                    <Box sx={{ px: 3, py: 2 }}>
                        {order.items.map((item, index) => (
                            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.5, borderBottom: index < order.items.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                                <Box
                                    component="img"
                                    src={getImageUrl(item.productId.images?.[0] || "")}
                                    sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1 }}
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Typography fontWeight="bold">
                                        {item.productId.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    {order.status === "delivered" && (
                                        reviewedProductIds.has(item.productId._id) ? (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{ color: "#666", borderColor: "#ccc", fontSize: 11 }}
                                                onClick={() => navigate(`/${item.productId.category}/${item.productId._id}/reviews`)}
                                                >
                                                View Review
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{ color: "#c8a951", borderColor: "#c8a951", fontSize: 11 }}
                                                onClick={() => setReviewDialog({ productId: item.productId._id, productName: item.productId.name })}
                                            >
                                                Write Review
                                            </Button>
                                        )
                                    )}
                                    <Typography fontWeight="bold">
                                        {"$"}{item.price.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}

                        {/* Order Summary */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3, py: 2, borderTop: "1px solid #e0e0e0" }}>
                            <Typography fontWeight="bold">Total: {"$"}{order.totalPrice.toFixed(2)}</Typography>
                            {order.status === "shipped" && (
                                <Button variant="outlined" size="small">Track Order</Button>
                            )}
                        </Box>
                    </Box>
                </Box>
            ))}
            {reviewDialog && (
                <WriteReviewDialog
                    open={true}
                    onClose={() => setReviewDialog(null)}
                    productId={reviewDialog.productId}
                    productName={reviewDialog.productName}
                    onSuccess={() => setReviewedProductIds(new Set([...reviewedProductIds, reviewDialog.productId]))}
                />
            )}
        </Box>
    );
};

export default OrderHistorySection;