import { useState, useEffect } from "react";
import apiClient from "../services/api-client";
import type { ProductFromServer } from "../services/products-api";
import { getImageUrl } from "../utils/format";

const colorMap: Record<string, string> = {
    black: "#000000",
    white: "#FFFFFF",
    navy: "#1a237e",
    blue: "#1565c0",
    red: "#c62828",
    green: "#2e7d32",
    brown: "#5d4037",
    beige: "#d4c5a9",
    cream: "#f5f5dc",
    grey: "#9e9e9e",
    gray: "#9e9e9e",
    pink: "#e91e63",
    gold: "#c8a951",
    silver: "#bdbdbd",
    tan: "#d2b48c",
    olive: "#6b8e23",
    burgundy: "#800020",
    camel: "#c19a6b",
    ivory: "#fffff0",
    coral: "#ff6f61",
    charcoal: "#36454f",
    khaki: "#c3b091",
    denim: "#1560bd",
    taupe: "#483c32",
    wine: "#722f37",
    mustard: "#e1ad01",
    lavender: "#b57edc",
    teal: "#008080",
    rust: "#b7410e",
    stone: "#928e85",
    chocolate: "#7b3f00",
    nude: "#e3bc9a",
    mauve: "#915f6d",
    sage: "#b2ac88",
    copper: "#b87333",
    pewter: "#8e8e8e",
    tortoise: "#8b4513",
};

function getColorValue(colorName: string): string {
    const lower = colorName.toLowerCase();
    if (colorMap[lower]) {
        return colorMap[lower];
    }

    // Try partial match (e.g. "Light Blue" contains "blue")
    for (const [key, value] of Object.entries(colorMap)) {
        if (lower.includes(key)) {
            return value;
        }
    }

    return "#cccccc";
}

export interface ProductDetail {
    id: string;
    name: string;
    type: string;
    price: number;
    oldPrice?: number;
    rating: number;
    reviewCount: number;
    images: { src: string; alt: string }[];
    colors: { name: string; value: string; imageIndex: number }[];
    sizes: string[];
    stock: number;
    category: string;
    description: string;
    features: string[];
    reviewBreakdown: { stars: number; percentage: number }[];
    shippingInfo: string;
    returnsInfo: string;
}

const DEFAULT_SHIPPING_INFO = "Free standard shipping on all orders over $100. Standard delivery takes 3-5 business days. Express shipping available at checkout for 1-2 business day delivery.";
const DEFAULT_RETURNS_INFO = "We accept returns within 30 days of delivery. Items must be unworn, unwashed, and with original tags attached. Free return shipping on all domestic orders.";

const useProductDetail = (productId: string | undefined) => {
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (!productId) return;

        const fetchProduct = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await apiClient.get<ProductFromServer>(`/products/${productId}`);
                const p = response.data;

                const detail: ProductDetail = {
                    id: p._id,
                    name: p.name,
                    type: p.type,
                    price: p.salePrice || p.price,
                    oldPrice: p.salePrice ? p.price : undefined,
                    rating: 0,
                    reviewCount: 0,
                    images: p.images.map((img) => ({
                        src: getImageUrl(img),
                        alt: p.name,
                    })),
                    colors: p.colors.map((color) => ({
                        name: color,
                        value: getColorValue(color),
                        imageIndex: 0,
                    })),
                    sizes: p.sizes,
                    stock: p.stock,
                    category: p.category,
                    description: p.description,
                    features: p.features,
                    reviewBreakdown: [],
                    shippingInfo: DEFAULT_SHIPPING_INFO,
                    returnsInfo: DEFAULT_RETURNS_INFO,
                };

                setProduct(detail);

                if (p.colors.length > 0) {
                    setSelectedColor(p.colors[0]);
                }
                if (p.sizes.length > 0) {
                    setSelectedSize(p.sizes[0]);
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Failed to load product");
            }

            setLoading(false);
        };

        fetchProduct();
    }, [productId]);

    const incrementQuantity = () => {
        if (product && quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const savings = product && product.oldPrice
        ? product.oldPrice - product.price
        : 0;

    return {
        product,
        loading,
        error,
        selectedImageIndex,
        setSelectedImageIndex,
        selectedColor,
        setSelectedColor,
        selectedSize,
        setSelectedSize,
        quantity,
        incrementQuantity,
        decrementQuantity,
        activeTab,
        setActiveTab,
        savings,
    };
};

export default useProductDetail;
