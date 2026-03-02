import BaseService from "./baseService";
import cartModel from "../models/cartModel";
import { ICartItem } from "../models/cartModel";


class CartService extends BaseService {
    constructor() {
        super(cartModel);
    }

     async getCartByUserId(userId: string) {
        const cart = await cartModel.findOne({ userId });
        return cart;
    }

    async addItemToCart(userId: string, item: ICartItem) {
        let cart = await cartModel.findOne({ userId });

        if (!cart) {
            cart = await cartModel.create({ userId, items: [item] });
            return cart;
        }

        const existingItem = cart.items.find(
            (i: ICartItem) =>
                i.productId.toString() === item.productId.toString() &&
                i.size === item.size &&
                i.color === item.color
        );

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.items.push(item);
        }

        await cart.save();
        return cart;
    }

     async updateItemQuantity(userId: string, itemId: string, quantity: number) {
        const cart = await cartModel.findOne({ userId });
        if (!cart) throw "Cart not found";

        const item = cart.items.id(itemId);
        if (!item) throw "Item not found in cart";

        item.quantity = quantity;
        await cart.save();
        return cart;
    }

    async removeItemFromCart(userId: string, itemId: string) {
        const cart = await cartModel.findOne({ userId });
        if (!cart) throw "Cart not found";

        cart.items.pull(itemId);
        await cart.save();
        return cart;
    }

    async clearCart(userId: string) {
        const cart = await cartModel.findOneAndUpdate(
            { userId },
            { items: [] },
            { new: true }
        );
        return cart;
    }
}

export default new CartService();