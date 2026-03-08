import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import WishlistService from "../services/wishlistService";

const getWishlist = async (req: AuthRequest, res: Response) => {
    try {
        const wishlist = await WishlistService.getWishlistByUserId(req.userId!);
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ error: "Failed to get wishlist" });
    }
};

const addToWishlist = async (req: AuthRequest, res: Response) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            res.status(400).json({ error: "Product ID is required" });
            return;
        }

        const wishlist = await WishlistService.addProductToWishlist(req.userId!, productId);
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ error: "Failed to add product to wishlist" });
    }
};

const removeFromWishlist = async (req: AuthRequest, res: Response) => {
    try {
        const wishlist = await WishlistService.removeProductFromWishlist(req.userId!, String(req.params.productId));
        res.status(200).json(wishlist);
    } catch (error: any) {
        if (error === "Wishlist not found") {
            res.status(404).json({ error });
            return;
        }
        res.status(500).json({ error: "Failed to remove product from wishlist" });
    }
};

export default {
    getWishlist,
    addToWishlist,
    removeFromWishlist
};