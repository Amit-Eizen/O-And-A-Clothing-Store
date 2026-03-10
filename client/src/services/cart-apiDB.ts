import apiClient from "./api-client";
import type { LocalCartItem } from "./cart-localStorage";

export interface ServerCartItem extends LocalCartItem {
    _id: string;
}

export const fetchCart = async (): Promise<ServerCartItem[]> => {
    const res = await apiClient.get("/cart");
    return res.data.items || [];
};

export const addItemToCart = async (item: { productId: string; quantity: number; size: string; color: string; price: number }) => {
    const res = await apiClient.post("/cart/items", item);
    return res.data;
};

export const updateCartItemQuantity = async (itemId: string, quantity: number) => {
    const res = await apiClient.put(`/cart/items/${itemId}`, { quantity });
    return res.data;
};

export const removeItemFromCart = async (itemId: string) => {
    const res = await apiClient.delete(`/cart/items/${itemId}`);
    return res.data;
};

export const mergeCart = async (items: { productId: string; quantity: number; size: string; color: string; price: number }[]) => {
    const res = await apiClient.post("/cart/merge", { items });
    return res.data;
};

export const clearCart = async () => {
    const res = await apiClient.delete("/cart");
    return res.data;
};