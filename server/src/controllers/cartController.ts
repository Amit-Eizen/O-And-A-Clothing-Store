import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import cartService from "../services/cartService";

const getCartByUserId = async (req: AuthRequest, res: Response) => {
    try {
        const cart = await cartService.getCartByUserId(req.userId!);
        if (!cart) {
            return res.status(200).json({ userId: req.userId, items: [] });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve cart" });
    }
};

const addItemToCart = async (req: AuthRequest, res: Response)  => {
    try {
        const cart = await cartService.addItemToCart(req.userId!, req.body);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: "Failed to add item to cart" });
    }
};

const updateItemQuantity = async (req: AuthRequest, res: Response) => {
    try {
        const { quantity } = req.body;
        const cart = await cartService.updateItemQuantity(req.userId!, String(req.params.itemId), quantity);
        res.status(200).json(cart);
    } catch (error: any) {
        res.status(404).json({ error: error });
    }
};

const removeItemFromCart = async (req: AuthRequest, res: Response) => {
    try {
        const cart = await cartService.removeItemFromCart(req.userId!, String(req.params.itemId));
        res.status(200).json(cart);
    } catch (error: any) {
        res.status(404).json({ error: error });
    }
};

const clearCart = async (req: AuthRequest, res: Response) => {
    try {
        const cart = await cartService.clearCart(req.userId!);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: "Failed to clear cart" });
    }
};

export default {
    getCartByUserId,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart
};