import { useEffect, useState } from "react";
import { Box, Typography, Chip, Button } from "@mui/material";
import apiClient from "../../services/api-client";

interface OrderItem {
    productId: {
        _id: string;
        name: string;
        images: string[];
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

const OrderHistorySection = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get("/orders")
            .then((res) => setOrders(res.data))
            .catch((err) => console.error("Failed to fetch orders:", err))
            .finally(() => setLoading(false));
    }, []);

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
                                {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
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
                                    src={`${apiClient.defaults.baseURL}${item.productId.images?.[0]}`}
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
                                <Typography fontWeight="bold">
                                    {"$"}{item.price.toFixed(2)}
                                </Typography>
                            </Box>
                        ))}

                        {/* Order Summary */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3, py: 2, borderTop: "1px solid #e0e0e0" }}>
                            <Typography fontWeight="bold">Total: {"$"}{order.totalPrice.toFixed(2)}</Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                                {order.status === "shipped" && (
                                    <Button variant="outlined" size="small">Track Order</Button>
                                )}
                                {order.status === "delivered" && (
                                    <Button variant="outlined" size="small" sx={{ color: "#c8a951", borderColor: "#c8a951" }}>Write Review</Button>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default OrderHistorySection;