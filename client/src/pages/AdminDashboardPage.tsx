import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box } from "@mui/material";
import { isAdmin } from "../utils/adminAuth";
import AdminNavbar from "../components/admin/AdminNavbar";
import DashboardStatsSection from "../components/admin/DashboardStatsSection";
import OrdersManagementSection from "../components/admin/OrdersManagementSection";
import ProductsManagementSection from "../components/admin/ProductsManagementSection";
import UsersSection from "../components/admin/UsersSection";
import SettingsSection from "../components/admin/SettingsSection";

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeSection = searchParams.get("section") || "stats";

    useEffect(() => {
        if (!isAdmin()) {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    const handleSectionChange = (section: string) => {
        setSearchParams({ section });
    };

    if (!isAdmin()) return null;

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
            <AdminNavbar activeSection={activeSection} onSectionChange={handleSectionChange} />

            <Box sx={{ maxWidth: 1400, mx: "auto", p: 4 }}>
                {activeSection === "stats" && <DashboardStatsSection onNavigate={handleSectionChange} />}
                {activeSection === "orders" && <OrdersManagementSection />}
                {activeSection === "products" && <ProductsManagementSection />}
                {activeSection === "users" && <UsersSection />}
                {activeSection === "settings" && <SettingsSection />}
            </Box>
        </Box>
    );
};

export default AdminDashboardPage;
