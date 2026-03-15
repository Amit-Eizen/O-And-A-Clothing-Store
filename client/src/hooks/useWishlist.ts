import { useState, useEffect } from "react";
import apiClient from "../services/api-client";

const useWishlist = () => {
    const [wishlistIds, setWishlistIds] = useState<string[]>([]);
    const [snackMessage, setSnackMessage] = useState("");

    const isLoggedIn = () => !!localStorage.getItem("token");

    useEffect(() => {
        if (!isLoggedIn()) return;

        apiClient.get("/wishlist")
            .then((res) => {
                const ids = res.data.products.map((p: any) => p._id);
                setWishlistIds(ids);
            })
            .catch(() => {});
    }, []);

    const isInWishlist = (productId: string) => wishlistIds.includes(productId);

    const toggleWishlist = async (productId: string) => {
        if (!isLoggedIn()) {
            setSnackMessage("Please log in to add items to your wishlist");
            return;
        }

        if (isInWishlist(productId)) {
            setWishlistIds(wishlistIds.filter((id) => id !== productId));
            try {
                await apiClient.delete(`/wishlist/${productId}`);
            } catch {
                setWishlistIds((prev) => [...prev, productId]);
            }
        } else {
            setWishlistIds([...wishlistIds, productId]);
            try {
                await apiClient.post("/wishlist", { productId });
            } catch {
                setWishlistIds((prev) => prev.filter((id) => id !== productId));
            }
        }
    };

    const closeSnack = () => setSnackMessage("");

    return { isInWishlist, toggleWishlist, snackMessage, closeSnack };
};

export default useWishlist;
