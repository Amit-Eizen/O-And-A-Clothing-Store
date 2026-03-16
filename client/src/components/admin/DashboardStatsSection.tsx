import { useEffect, useState } from "react";
import { Box, Paper, Typography, CircularProgress, Chip } from "@mui/material";
import { fetchDashboardStats, fetchLowStockProducts } from "../../services/admin-api";
import type { DashboardStats } from "../../services/admin-api";
import type { ProductFromServer } from "../../services/products-api";
import statusColors from "../../utils/orderStatusColors";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

interface DashboardStatsSectionProps {
    onNavigate: (section: string) => void;
}

const statIcons = [
    <InventoryIcon sx={{ color: "#c8a951" }} />,
    <PeopleIcon sx={{ color: "#7c6bc4" }} />,
    <ShoppingCartIcon sx={{ color: "#4caf50" }} />,
    <AttachMoneyIcon sx={{ color: "#2196f3" }} />,
];

const DashboardStatsSection = ({ onNavigate }: DashboardStatsSectionProps) => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [lowStock, setLowStock] = useState<ProductFromServer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetchDashboardStats(),
            fetchLowStockProducts(10),
        ])
            .then(([statsData, lowStockData]) => {
                setStats(statsData);
                setLowStock(lowStockData);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <CircularProgress />;
    if (!stats) return <Typography>Failed to load stats</Typography>;

    const statCards = [
        { label: "Total Products", value: stats.totalProducts },
        { label: "Total Users", value: stats.totalUsers },
        { label: "Total Orders", value: stats.totalOrders },
        { label: "Revenue", value: `$${stats.totalRevenue.toFixed(2)}` },
    ];

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={1}>Dashboard</Typography>
            <Typography color="text.secondary" mb={3}>
                Welcome back! Here's what's happening with your store today.
            </Typography>

            {/* Stat Cards */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, mb: 4 }}>
                {statCards.map((card, index) => (
                    <Paper key={card.label} sx={{ p: 3, border: "1px solid #eee" }} elevation={0}>
                        <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                            {statIcons[index]}
                        </Box>
                        <Typography variant="h4" fontWeight="bold">{card.value}</Typography>
                        <Typography color="text.secondary" variant="body2">{card.label}</Typography>
                    </Paper>
                ))}
            </Box>

            {/* Recent Orders + Low Stock */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
                {/* Recent Orders */}
                <Paper sx={{ p: 3, border: "1px solid #eee" }} elevation={0}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">Recent Orders</Typography>
                        <Typography
                            sx={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary", "&:hover": { color: "#000" } }}
                            onClick={() => onNavigate("orders")}
                        >
                            View All <ArrowForwardIcon sx={{ fontSize: 16 }} />
                        </Typography>
                    </Box>
                    {stats.recentOrders.map((order) => (
                        <Box key={order._id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1.5, borderBottom: "1px solid #f0f0f0" }}>
                            <Box>
                                <Typography fontWeight={600} variant="body2">{order.orderNumber || order._id.slice(-6)}</Typography>
                                <Typography color="text.secondary" variant="caption">{order.userId?.username || "Unknown"}</Typography>
                                <Typography color="text.secondary" variant="caption" display="block">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: "right" }}>
                                <Chip label={order.status} color={statusColors[order.status] || "default"} size="small" sx={{ mb: 0.5 }} />
                                <Typography fontWeight={600} variant="body2">{"$"}{order.totalPrice.toFixed(2)}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Paper>

                {/* Low Stock Alert */}
                <Paper sx={{ p: 3, border: "1px solid #eee" }} elevation={0}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <WarningAmberIcon sx={{ color: "#ff9800" }} />
                            <Typography variant="h6" fontWeight="bold">Low Stock Alert</Typography>
                        </Box>
                        <Typography
                            sx={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary", "&:hover": { color: "#000" } }}
                            onClick={() => onNavigate("products")}
                        >
                            Manage <ArrowForwardIcon sx={{ fontSize: 16 }} />
                        </Typography>
                    </Box>
                    {lowStock.length === 0 ? (
                        <Typography color="text.secondary">All products are well stocked!</Typography>
                    ) : (
                        lowStock.map((product) => (
                            <Box key={product._id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1.5, borderBottom: "1px solid #f0f0f0" }}>
                                <Box>
                                    <Typography fontWeight={600} variant="body2">{product.name}</Typography>
                                    <Typography color="text.secondary" variant="caption">{product.type}</Typography>
                                </Box>
                                <Chip label={`${product.stock} left`} color="error" size="small" variant="outlined" />
                            </Box>
                        ))
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default DashboardStatsSection;
