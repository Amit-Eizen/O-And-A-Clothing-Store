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
        
            if (existingItem) {
                return prev.map((i) => {
                    if (i === existingItem) {
                        return { ...i, quantity: i.quantity + quantity };
                    }
                    return i;
                });
            }
            return [...prev, { ...item, quantity: quantity }];
        });
    
        if (isLoggedIn()) {
            addItemToCart({ 
                productId: item.productId, 
                quantity: quantity, 
                size: item.size,
                color: item.color,
                price: item.price
            });
        } else {
            const updatedItems = [...getGuestCart()];
            const existing = findItem(updatedItems, item.productId, item.size, item.color);
            if (existing) {
                existing.quantity += quantity;
            } else {
                updatedItems.push({ ...item, quantity });
            }
            saveGuestCart(updatedItems);
        }
    };

    const updateItemQuantity = async (productId: string, size: string, color: string, quantity: number) => {
        let itemId: string | undefined;

        setCartItems((prev) => {
            const existingItem = findItem(prev, productId, size, color);
            if (!existingItem) return prev;

            itemId = existingItem._id;

            if (quantity <= 0) {
                return prev.filter((i) => i !== existingItem);
            }
            return prev.map((i) => {
                if (i === existingItem) {
                    return { ...i, quantity };
                }
                return i;
            });
        });

        if (isLoggedIn() && itemId) {
            if (quantity <= 0) {
                removeItemFromCart(itemId);
            } else {
                updateCartItemQuantity(itemId, quantity);
            }
        } else if (!isLoggedIn()) {
            const updatedItems = getGuestCart().map((i) => {
                if (i.productId === productId && i.size === size && i.color === color) {
                    return { ...i, quantity };
                }
                return i;
            }).filter((i) => i.quantity > 0);
            saveGuestCart(updatedItems);
        }
    };

    const removeItem = (productId: string, size: string, color: string) => {
        let itemId: string | undefined;
        
        setCartItems((prev) => {
            const existingItem = findItem(prev, productId, size, color);
            if (!existingItem) return prev;
        
            itemId = existingItem._id;
            return prev.filter((i) => i !== existingItem);
        });
    
        if (isLoggedIn() && itemId) {
            removeItemFromCart(itemId);
        } else if (!isLoggedIn()) {
            const updatedItems = getGuestCart().filter(
                (i) => !(i.productId === productId && i.size === size && i.color === color)
            );
            saveGuestCart(updatedItems);
        }
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
    const shipping = subtotal >= 149 ? 0 : 20;
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