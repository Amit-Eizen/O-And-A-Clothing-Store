import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Typography, Breadcrumbs, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";
import AccountSidebar from "../components/account/AccountSidebar";
import apiClient from "../services/api-client";
import OrderHistorySection from "../components/account/OrderHistorySection";
import MyReviewsSection from "../components/account/MyReviewsSection";
import MyCommentsSection from "../components/account/MyCommentsSection";
import WishlistSection from "../components/account/WishlistSection";
import AccountSettingsSection from "../components/account/AccountSettingsSection";

const MyAccountPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeSection = searchParams.get("section") || "orders";

    const [user, setUser] = useState<{ _id: string; username: string; email: string; profileImage?: string } | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = () => {
        apiClient.get("/users/profile").then((res) => setUser(res.data));
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/auth", { replace: true });
            return;
        }

        apiClient.get("/users/profile")
            .then((res) => {
                setUser(res.data);
                setLoading(false);
            })
            .catch(() => {
                navigate("/auth", { replace: true });
            });
    }, [navigate]);

    const handleSectionChange = (section: string) => {
        setSearchParams({ section });
    };

    if (loading || !user) return null;

    return (
        <Box>
            {/* Breadcrumb */}
            <Box sx={{ backgroundColor: "#faf9f6", py: 2, px: { xs: 2, md: 6 } }}>
                <Breadcrumbs>
                    <MuiLink component={Link} to="/" underline="hover" color="inherit">
                        Home
                    </MuiLink>
                    <Typography color="text.primary">
                        My Account
                    </Typography>
                </Breadcrumbs>
            </Box>

            {/* Content */}
            <Box sx={{ display: "flex", maxWidth: 1280, mx: "auto" }}>
                <AccountSidebar
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                    username={user.username}
                    email={user.email}
                    profileImage={user.profileImage}
                />

                <Box sx={{ flex: 1, p: 4 , pt: 12}}>
                    {activeSection === "orders" && <OrderHistorySection userId={user._id} />}
                    
                    {activeSection === "reviews" && <MyReviewsSection userId={user._id} />}

                    {activeSection === "comments" && <MyCommentsSection />}
                
                    {activeSection === "wishlist" && <WishlistSection />}

                    {activeSection === "settings" && <AccountSettingsSection onProfileUpdate={refreshUser} />}
                </Box>
            </Box>
        </Box>
    );
};

export default MyAccountPage;