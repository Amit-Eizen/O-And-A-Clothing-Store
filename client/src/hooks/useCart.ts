import { useState } from "react";
import product1 from "../assets/product-1.jpg";
import product2 from "../assets/product-2.jpg";
import product3 from "../assets/product-3.jpg";

const initialCartItems = [
    { id: 1, name: "Silk Midi Dress", type: "DRESS", size: "M", color: "Crimson Red", price: 200, quantity: 1, image: product1 },
    { id: 2, name: "Cashmere Sweater", type: "JACKET", size: "S", color: "Cream", price: 100, quantity: 1, image: product2 },
    { id: 3, name: "Leather Tote", type: "BAG", size: "One Size", color: "Black", price: 125, quantity: 1, image: product3 },
];

const useCart = () => {
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    const updateQuantity = (id: number, quantity: number) => {
        setCartItems((prev) => prev.map((item) => item.id === id ? { ...item, quantity } : item));
    };

    const removeItem = (id: number) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 150 ? 0 : 20;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return {
        cartItems,
        checkoutOpen,
        setCheckoutOpen,
        updateQuantity,
        removeItem,
        subtotal,
        shipping,
        tax,
        total,
    };
};

export default useCart;
