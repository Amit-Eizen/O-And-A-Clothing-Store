import BaseService from "./baseService";
import ordersModel from "../models/ordersModel";
import cartService from "../services/cartService";
import { ICartItem } from "../models/cartModel";

class OrdersService extends BaseService {
    constructor() {
        super(ordersModel);
    }

    async createOrder(userId: string, shipping: number, tax: number, shippingAddress: object) {
        const cart = await cartService.getCartByUserId(userId);
        if (!cart || cart.items.length === 0) {
            throw "Cart is empty";
        }
    
        // Merge duplicate items (same productId + size + color)
        const mergedItems: ICartItem[] = [];
        for (const item of cart.items) {
            const existing = mergedItems.find(
                (i) =>
                    i.productId.toString() === item.productId.toString() &&
                    i.size === item.size &&
                    i.color === item.color
            );
            if (existing) {
                existing.quantity += item.quantity;
            } else {
                mergedItems.push({ ...item.toObject() });
            }
        }
    
        const totalPrice = mergedItems.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity, 0
        ) + (shipping || 0) + (tax || 0);
    
        const orderNumber = await this.generateOrderNumber();
    
        const order = await this.model.create({
            userId,
            orderNumber,
            items: mergedItems,
            totalPrice,
            shipping: shipping || 0,
            tax: tax || 0,
            shippingAddress
        });
    
        await cartService.clearCart(userId);
    
        return order;
    }

    async getOrdersByUserId(userId: string) {
        const orders = await this.model
            .find({ userId })
            .sort({ createdAt: -1 })
            .populate("items.productId", "name images");
        return orders;
    }

    async updateOrderStatus(orderId: string, status: string) {
        const order = await this.model.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        return order;
    }

    async generateOrderNumber(): Promise<string> {
        const year = new Date().getFullYear();
        const count = await this.model.countDocuments();
        const orderNumber = `ORD-${year}-${String(count + 1).padStart(3, "0")}`;
        return orderNumber;
    }
}

export default new OrdersService();
