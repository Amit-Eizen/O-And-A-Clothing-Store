import BaseService from "./baseService";
import ordersModel from "../models/ordersModel";
import cartService from "../services/cartService";

class OrdersService extends BaseService {
    constructor() {
        super(ordersModel);
    }

    async createOrder(userId: string, shipping: number, shippingAddress: object) {
        const cart = await cartService.getCartByUserId(userId);
        if (!cart || cart.items.length === 0) {
            throw "Cart is empty";
        }

        const totalPrice = cart.items.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity, 0
        ) + (shipping || 0);

        const orderNumber = await this.generateOrderNumber();

        const order = await this.model.create({
            userId,
            orderNumber,
            items: cart.items,
            totalPrice,
            shipping: shipping || 0,
            shippingAddress
        });

        await cartService.clearCart(userId);

        return order;
    }

    async getOrdersByUserId(userId: string) {
        const orders = await this.model.find({ userId }).sort({ createdAt: -1 });
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
