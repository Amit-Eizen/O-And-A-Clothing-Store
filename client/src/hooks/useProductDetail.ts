import { useState, useEffect } from "react";
import product1 from "../assets/product-1.jpg";
import product2 from "../assets/product-2.jpg";
import product3 from "../assets/product-3.jpg";
import product4 from "../assets/product-4.jpg";

interface ProductDetail {
    id: number;
    name: string;
    type: string;
    price: number;
    oldPrice?: number;
    rating: number;
    reviewCount: number;
    images: {src: string; alt: string}[];
    colors: {name: string; value: string; imageIndex: number}[];
    sizes: string[];
    stock: number;
    category: string;
    description: string;
    features: string[];
    reviewBreakdown: { stars: number; percentage: number }[];
    shippingInfo: string;
    returnsInfo: string;
}

const mockProducts: ProductDetail[] = [
    {
        id: 1,
        name: "Premium Tee",
        type: "T-Shirt",
        price: 55,
        oldPrice: 75,
        rating: 4.8,
        reviewCount: 345,
        images: [
            { src: product1, alt: "Premium Tee - Front" },
            { src: product2, alt: "Premium Tee - Back" },
            { src: product3, alt: "Premium Tee - Side" },
            { src: product4, alt: "Premium Tee - Detail" },
        ],
        colors: [
            { name: "White", value: "#FFFFFF", imageIndex: 0 },
            { name: "Black", value: "#000000", imageIndex: 1 },
            { name: "Grey Heather", value: "#B0B0B0", imageIndex: 2 },
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        stock: 8,
        category: "unisex",
        description: "Elevate your everyday wardrobe with our Premium Tee. Crafted from 100% organic Pima cotton, this essential piece offers an unparalleled combination of softness, durability, and timeless style. The relaxed yet refined fit makes it perfect for both casual outings and layered looks.",
        features: [
            "100% Organic Pima Cotton",
            "Pre-shrunk fabric maintains shape",
            "Reinforced collar and cuffs",
            "Tagless design for ultimate comfort",
            "Available in 3 colorways",
        ],
        reviewBreakdown: [
            { stars: 5, percentage: 72 },
            { stars: 4, percentage: 18 },
            { stars: 3, percentage: 6 },
            { stars: 2, percentage: 3 },
            { stars: 1, percentage: 1 },
        ],
        shippingInfo: "Free standard shipping on orders over $150. Standard delivery takes 3-5 business days. Express shipping available at checkout for 1-2 business day delivery.",
        returnsInfo: "We offer a 30-day return policy for all unworn items in original condition with tags attached. Free returns on all domestic orders. Exchanges are subject to availability.",
    },
        {
        id: 2,
        name: "Cashmere Sweater",
        type: "Jacket",
        price: 289,
        oldPrice: 350,
        rating: 4.5,
        reviewCount: 210,
        images: [
            { src: product2, alt: "Cashmere Sweater - Front" },
            { src: product3, alt: "Cashmere Sweater - Back" },
            { src: product1, alt: "Cashmere Sweater - Side" },
            { src: product4, alt: "Cashmere Sweater - Detail" },
        ],
        colors: [
            { name: "Burgundy", value: "#800020", imageIndex: 0 },
            { name: "Cream", value: "#FFFDD0", imageIndex: 1 },
        ],
        sizes: ["S", "M", "L", "XL"],
        stock: 5,
        category: "women",
        description: "Luxuriously soft cashmere sweater perfect for layering. This timeless piece features a relaxed fit and ribbed detailing at the cuffs and hem.",
        features: ["100% Pure Cashmere", "Ribbed cuffs and hem", "Relaxed fit", "Dry clean only"],
        reviewBreakdown: [
            { stars: 5, percentage: 65 },
            { stars: 4, percentage: 22 },
            { stars: 3, percentage: 8 },
            { stars: 2, percentage: 3 },
            { stars: 1, percentage: 2 },
        ],
        shippingInfo: "Free standard shipping on orders over $150. Standard delivery takes 3-5 business days.",
        returnsInfo: "30-day return policy for unworn items in original condition with tags attached.",
    },
    {
        id: 3,
        name: "Tailored Blazer",
        type: "Jacket",
        price: 425,
        rating: 4.9,
        reviewCount: 128,
        images: [
            { src: product3, alt: "Tailored Blazer - Front" },
            { src: product1, alt: "Tailored Blazer - Back" },
            { src: product2, alt: "Tailored Blazer - Side" },
            { src: product4, alt: "Tailored Blazer - Detail" },
        ],
        colors: [
            { name: "Navy", value: "#000080", imageIndex: 0 },
            { name: "Black", value: "#000000", imageIndex: 1 },
        ],
        sizes: ["XS", "S", "M", "L"],
        stock: 3,
        category: "women",
        description: "A perfectly structured blazer that transitions seamlessly from office to evening. Crafted with premium wool blend for a refined silhouette.",
        features: ["Wool blend fabric", "Fully lined", "Two-button closure", "Functional pockets"],
        reviewBreakdown: [
            { stars: 5, percentage: 80 },
            { stars: 4, percentage: 14 },
            { stars: 3, percentage: 4 },
            { stars: 2, percentage: 1 },
            { stars: 1, percentage: 1 },
        ],
        shippingInfo: "Free standard shipping on orders over $150. Standard delivery takes 3-5 business days.",
        returnsInfo: "30-day return policy for unworn items in original condition with tags attached.",
    },
    {
        id: 4,
        name: "Wide Leg Trousers",
        type: "Pants",
        price: 195,
        rating: 4.6,
        reviewCount: 89,
        images: [
            { src: product4, alt: "Wide Leg Trousers - Front" },
            { src: product1, alt: "Wide Leg Trousers - Back" },
            { src: product2, alt: "Wide Leg Trousers - Side" },
            { src: product3, alt: "Wide Leg Trousers - Detail" },
        ],
        colors: [
            { name: "Black", value: "#000000", imageIndex: 0 },
            { name: "Beige", value: "#F5F5DC", imageIndex: 1 },
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 12,
        category: "women",
        description: "Elegant wide leg trousers with a high waist and flowing silhouette. Perfect for creating a sophisticated, elongated look.",
        features: ["High-rise waist", "Wide leg cut", "Side zip closure", "Wrinkle-resistant fabric"],
        reviewBreakdown: [
            { stars: 5, percentage: 60 },
            { stars: 4, percentage: 25 },
            { stars: 3, percentage: 10 },
            { stars: 2, percentage: 3 },
            { stars: 1, percentage: 2 },
        ],
        shippingInfo: "Free standard shipping on orders over $150. Standard delivery takes 3-5 business days.",
        returnsInfo: "30-day return policy for unworn items in original condition with tags attached.",
    },
    {
        id: 5,
        name: "Linen Shirt",
        type: "Shirt",
        price: 175,
        rating: 4.4,
        reviewCount: 156,
        images: [
            { src: product1, alt: "Linen Shirt - Front" },
            { src: product4, alt: "Linen Shirt - Back" },
            { src: product2, alt: "Linen Shirt - Side" },
            { src: product3, alt: "Linen Shirt - Detail" },
        ],
        colors: [
            { name: "White", value: "#FFFFFF", imageIndex: 0 },
            { name: "Light Blue", value: "#ADD8E6", imageIndex: 1 },
        ],
        sizes: ["S", "M", "L", "XL"],
        stock: 15,
        category: "women",
        description: "A breezy linen shirt that embodies effortless elegance. Perfect for warm-weather styling with a relaxed, oversized fit.",
        features: ["100% European Linen", "Oversized relaxed fit", "Mother-of-pearl buttons", "Pre-washed for softness"],
        reviewBreakdown: [
            { stars: 5, percentage: 55 },
            { stars: 4, percentage: 28 },
            { stars: 3, percentage: 10 },
            { stars: 2, percentage: 5 },
            { stars: 1, percentage: 2 },
        ],
        shippingInfo: "Free standard shipping on orders over $150. Standard delivery takes 3-5 business days.",
        returnsInfo: "30-day return policy for unworn items in original condition with tags attached.",
    },
    {
        id: 6,
        name: "Wrap Dress",
        type: "Dress",
        price: 155,
        rating: 4.7,
        reviewCount: 234,
        images: [
            { src: product2, alt: "Wrap Dress - Front" },
            { src: product1, alt: "Wrap Dress - Back" },
            { src: product3, alt: "Wrap Dress - Side" },
            { src: product4, alt: "Wrap Dress - Detail" },
        ],
        colors: [
            { name: "Forest Green", value: "#228B22", imageIndex: 0 },
            { name: "Black", value: "#000000", imageIndex: 1 },
            { name: "Wine", value: "#722F37", imageIndex: 2 },
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 9,
        category: "women",
        description: "A flattering wrap dress that suits every body type. The adjustable tie waist creates a beautiful silhouette while the V-neckline adds elegance.",
        features: ["Wrap-front design", "Adjustable tie waist", "Knee-length hem", "Machine washable"],
        reviewBreakdown: [
            { stars: 5, percentage: 68 },
            { stars: 4, percentage: 20 },
            { stars: 3, percentage: 7 },
            { stars: 2, percentage: 3 },
            { stars: 1, percentage: 2 },
        ],
        shippingInfo: "Free standard shipping on orders over $150. Standard delivery takes 3-5 business days.",
        returnsInfo: "30-day return policy for unworn items in original condition with tags attached.",
    },
    {
        id: 7,
        name: "Denim Jacket",
        type: "Jacket",
        price: 205,
        rating: 4.3,
        reviewCount: 178,
        images: [
            { src: product3, alt: "Denim Jacket - Front" },
            { src: product4, alt: "Denim Jacket - Back" },
            { src: product1, alt: "Denim Jacket - Side" },
            { src: product2, alt: "Denim Jacket - Detail" },
        ],
        colors: [
            { name: "Classic Blue", value: "#4169E1", imageIndex: 0 },
            { name: "Light Wash", value: "#B0C4DE", imageIndex: 1 },
        ],
        sizes: ["S", "M", "L", "XL"],
        stock: 7,
        category: "women",
        description: "A timeless denim jacket with a modern cut. Features premium stretch denim for comfort and a versatile style that pairs with everything.",
        features: ["Premium stretch denim", "Classic collar design", "Metal button closure", "Two chest pockets"],
        reviewBreakdown: [
            { stars: 5, percentage: 50 },
            { stars: 4, percentage: 30 },
            { stars: 3, percentage: 12 },
            { stars: 2, percentage: 5 },
            { stars: 1, percentage: 3 },
        ],
        shippingInfo: "Free standard shipping on orders over $150. Standard delivery takes 3-5 business days.",
        returnsInfo: "30-day return policy for unworn items in original condition with tags attached.",
    },
    {
        id: 8,
        name: "High Waist Jeans",
        type: "Jeans",
        price: 145,
        oldPrice: 195,
        rating: 4.6,
        reviewCount: 312,
        images: [
            { src: product4, alt: "High Waist Jeans - Front" },
            { src: product2, alt: "High Waist Jeans - Back" },
            { src: product3, alt: "High Waist Jeans - Side" },
            { src: product1, alt: "High Waist Jeans - Detail" },
        ],
        colors: [
            { name: "Dark Indigo", value: "#191970", imageIndex: 0 },
            { name: "Black", value: "#000000", imageIndex: 1 },
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 20,
        category: "women",
        description: "Our best-selling high waist jeans with the perfect amount of stretch. Designed to flatter your figure with a slim-straight leg and ankle-length cut.",
        features: ["Premium stretch denim", "High-rise waist", "Slim-straight leg", "Ankle length"],
        reviewBreakdown: [
            { stars: 5, percentage: 62 },
            { stars: 4, percentage: 24 },
            { stars: 3, percentage: 8 },
            { stars: 2, percentage: 4 },
            { stars: 1, percentage: 2 },
        ],
        shippingInfo: "Free standard shipping on orders over $150. Standard delivery takes 3-5 business days.",
        returnsInfo: "30-day return policy for unworn items in original condition with tags attached.",
    },

];

const useProductDetail = (productId: string | undefined) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState(0);

    const product = mockProducts.find((p) => p.id === Number(productId)) || null;

    useEffect(() => {
        if (product) {
            setSelectedColor(product.colors[0]?.name || "");
            setSelectedImageIndex(product.colors[0]?.imageIndex || 0);
        }
    }, [product?.id]);
    
    let savings = 0;
    if (product && product.oldPrice) {
        savings = product.oldPrice - product.price;
    }

    const incrementQuantity = () => {
        setQuantity((prev) => Math.min(prev + 1, product?.stock || 1));
    };

    const decrementQuantity = () => {
        setQuantity((prev) => Math.max(prev - 1, 1));
    }

    return {
        product,
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
}

export default useProductDetail;