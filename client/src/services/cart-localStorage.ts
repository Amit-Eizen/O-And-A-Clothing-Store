const STORAGE_KEY = "guest_cart";

export interface LocalCartItem {
    productId: string;
    name: string;
    type: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    image: string;
    category: string;
}

export const getGuestCart = (): LocalCartItem[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveGuestCart = (items: LocalCartItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const clearGuestCart = () => {
    localStorage.removeItem(STORAGE_KEY);
};