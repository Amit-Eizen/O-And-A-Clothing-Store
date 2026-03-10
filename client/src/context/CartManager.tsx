import { createContext, useState, useEffect, type ReactNode } from "react";
import { getGuestCart, saveGuestCart, clearGuestCart, type LocalCartItem } from "../services/cart-localStorage";
import { fetchCart, addItemToCart, updateCartItemQuantity, removeItemFromCart, mergeCart, clearCart as clearServerCart } from "../services/cart-apiDB";

interface CartItem extends LocalCartItem {
    _id?: string; 
}

interface CartContextType {
    cartItems: CartItem[];
    addItem: (item: Omit<CartItem, "quantity" | "_id">, quantity?: number) => void;
    updateItemQuantity: (productId: string, size: string, color: string, quantity: number) => void;
    removeItem: (productId: string, size: string, color: string) => void;
    clearCart: () => void;
    syncAfterLogin: () => Promise<void>;
    itemCount: number;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}

const isLoggedIn = () => !!localStorage.getItem("token");

const findItem = (items: CartItem[], productId: string, size: string, color: string) => 
    items.find((i) => i.productId === productId && i.size === size && i.color === color);

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Load cart on mount
    useEffect(() => {
        if (isLoggedIn()) {
            fetchCart()
            .then((items) => setCartItems(items))
            .catch(() => {});
        } else {
            setCartItems(getGuestCart());
        }
    }, []);
    
    // Sync guest cart to server after login
    const syncAfterLogin = async () => {
        const guestItems = getGuestCart();
        if (guestItems.length > 0) {
            try {
                await mergeCart(
                    guestItems.map(({ productId, quantity, size, color, price }) => ({
                        productId, quantity, size, color, price
                    }))
                );
                clearGuestCart();
            } catch (error) {
                console.error("Failed to merge cart:", error);
            }
        }
        // Always fetch the latest cart from server after login
        const items = await fetchCart();
        setCartItems(items);
    };

    const addItem = async (item: Omit<CartItem, "quantity" | "_id">, quantity: number = 1) => {
        setCartItems((prev) => {
            const existingItem = findItem(prev, item.productId, item.size, item.color);

            let updatedItems: CartItem[];
            if (existingItem) {
                updatedItems = prev.map((i) => {
                    if ( i === existingItem) {
                        return { ...i, quantity: i.quantity + quantity };
                    }
                    return i;
                });
            } else {
                updatedItems = [...prev, { ...item, quantity: quantity }];
            }

            if (isLoggedIn()) {
                addItemToCart({ 
                    productId: item.productId, 
                    quantity: quantity, 
                    size: item.size,
                    color: item.color,
                    price: item.price
                });
            } else {
                saveGuestCart(updatedItems);
            }
            return updatedItems;
        });
    };

    const updateItemQuantity = async (productId: string, size: string, color: string, quantity: number) => {
        setCartItems((prev) => {
            const existingItem = findItem(prev, productId, size, color);
            if (!existingItem) return prev;

            let updatedItems: CartItem[];
            if (quantity <= 0) {
                updatedItems = prev.filter((i) => i !== existingItem);
            } else {
                updatedItems = prev.map((i) => {
                    if (i === existingItem) {
                        return { ...i, quantity };
                    } 
                    return i;
                });
            }

            if (isLoggedIn() && existingItem._id) {
                if (quantity <= 0) {
                    removeItemFromCart(existingItem._id);
                } else {
                    updateCartItemQuantity(existingItem._id, quantity);
                }
            } else {
                saveGuestCart(updatedItems);
            }
            return updatedItems;
        });
    };

    const removeItem = (productId: string, size: string, color: string) => {
        setCartItems((prev) => {
            const existingItem = findItem(prev, productId, size, color);
            if (!existingItem) return prev;

            const updatedItems = prev.filter((i) => i !== existingItem);

            if (isLoggedIn() && existingItem._id) {
                removeItemFromCart(existingItem._id);
            } else {
                saveGuestCart(updatedItems);
            }
            return updatedItems;
        });
    };

    const clearCartItems = async () => {
        setCartItems([]);
        if (isLoggedIn()) {
            clearServerCart();
        } else {
            clearGuestCart();
        }
    };

    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 150 ? 0 : 20;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addItem, 
            updateItemQuantity,
            removeItem,
            clearCart: clearCartItems,
            syncAfterLogin,
            itemCount,
            subtotal,
            shipping,
            tax,
            total
        }}>
            {children}
         </CartContext.Provider>
    );
};                    