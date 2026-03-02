import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import ordersService from "../services/ordersService";
import cartService from "../services/cartService";

const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { shipping, shippingAddress } = req.body;
        const order = await ordersService.createOrder(req.userId!, shipping, shippingAddress);
        res.status(201).json(order);
    } catch (error: any) {
        if (error === "Cart is empty") {
            return res.status(400).json({ error });
        }
        res.status(500).json({ error: "Failed to create order" });
    }
};

const getOrdersByUserId = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await ordersService.getOrdersByUserId(req.userId!);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve orders" });
    }
};

const getOrderById = async (req: AuthRequest, res: Response) => {
    try {
        const order = await ordersService.getById(String(req.params.id));
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve order" });
    }
};

const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const order = await ordersService.updateOrderStatus(String(req.params.id), status);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: "Failed to update order status" });
    }
};

export default {
    createOrder,
    getOrdersByUserId,
    getOrderById,
    updateOrderStatus
};