import { useState } from "react";
import product1 from "../assets/product-1.jpg";
import product2 from "../assets/product-2.jpg";

interface Comment {
    name: string;
    avatarLetters: string;
    time: string;
    text: string;
}

interface Review {
    id: number;
    name: string;
    avatarLetters: string;
    date: string;
    rating: number;
    title: string;
    text: string;
    images: string[];
    helpfulCount: number;
    commentCount: number;
    comments: Comment[];
}

interface ProductReviewsData {
    [productId: number]: Review[];
}

const mockReviews: ProductReviewsData = {
    1: [
        {
            id: 1,
            name: "Sarah M.",
            avatarLetters: "SM",
            date: "Dec 15, 2024",
            rating: 5,
            title: "Absolutely Stunning!",
            text: "This dress exceeded all my expectations. The silk is luxurious and the fit is perfect. I've received so many compliments every time I wear it. The color is even more vibrant in person!",
            images: [product1, product2],
            helpfulCount: 45,
            commentCount: 2,
            comments: [
                { name: "Michelle A.", avatarLetters: "MA", time: "2 hours ago", text: "Totally agree! What size did you order?" },
                { name: "James K.", avatarLetters: "JK", time: "5 hours ago", text: "Thanks for the detailed review! Ordering now." },
            ],
        },
        {
            id: 2,
            name: "Michael T.",
            avatarLetters: "MT",
            date: "Dec 10, 2024",
            rating: 4,
            title: "Great quality, runs slightly large",
            text: "Beautiful dress with excellent craftsmanship. I ordered my usual size but found it runs a bit large. Would recommend sizing down for a more fitted look. Overall very happy with the purchase!",
            images: [],
            helpfulCount: 28,
            commentCount: 1,
            comments: [
                { name: "Laura B.", avatarLetters: "LB", time: "1 day ago", text: "Good to know about the sizing, thanks!" },
            ],
        },
        {
            id: 3,
            name: "Emma L.",
            avatarLetters: "EL",
            date: "Nov 28, 2024",
            rating: 5,
            title: "Worth every penny",
            text: "The color is even more beautiful in person! This has quickly become one of my favorite pieces in my wardrobe. The fabric quality is exceptional.",
            images: [],
            helpfulCount: 31,
            commentCount: 0,
            comments: [],
        },
        {
            id: 4,
            name: "Jessica R.",
            avatarLetters: "JR",
            date: "Nov 15, 2024",
            rating: 5,
            title: "Perfect for special occasions",
            text: "Wore this to a wedding and got so many compliments. The drape is beautiful and it photographs incredibly well. Will definitely be ordering in another color.",
            images: [product1],
            helpfulCount: 22,
            commentCount: 3,
            comments: [
                { name: "Nina S.", avatarLetters: "NS", time: "3 days ago", text: "Which color did you get?" },
                { name: "Jessica R.", avatarLetters: "JR", time: "3 days ago", text: "I got the crimson red!" },
                { name: "Tom H.", avatarLetters: "TH", time: "2 days ago", text: "Looks amazing in the photos!" },
            ],
        },
        {
            id: 5,
            name: "David K.",
            avatarLetters: "DK",
            date: "Nov 5, 2024",
            rating: 3,
            title: "Nice but expected more",
            text: "The quality is good but for the price I expected a bit more. The stitching could be better in some areas. The color is accurate though.",
            images: [],
            helpfulCount: 12,
            commentCount: 1,
            comments: [
                { name: "Store Team", avatarLetters: "ST", time: "4 days ago", text: "We're sorry to hear that. Please contact our support team for assistance." },
            ],
        },
    ],
};

const defaultReviews: Review[] = [
    {
        id: 1,
        name: "Alex P.",
        avatarLetters: "AP",
        date: "Dec 1, 2024",
        rating: 5,
        title: "Excellent product!",
        text: "Really impressed with the quality. Fits perfectly and looks even better in person. Would highly recommend to anyone looking for premium clothing.",
        images: [],
        helpfulCount: 18,
        commentCount: 0,
        comments: [],
    },
    {
        id: 2,
        name: "Rachel S.",
        avatarLetters: "RS",
        date: "Nov 20, 2024",
        rating: 4,
        title: "Great addition to my wardrobe",
        text: "Very happy with this purchase. The material feels premium and the fit is true to size. Only wish there were more color options available.",
        images: [],
        helpfulCount: 14,
        commentCount: 2,
        comments: [
            { name: "Mark D.", avatarLetters: "MD", time: "1 week ago", text: "Agreed, more colors would be great!" },
            { name: "Sophie L.", avatarLetters: "SL", time: "5 days ago", text: "I heard new colors are coming soon." },
        ],
    },
    {
        id: 3,
        name: "James W.",
        avatarLetters: "JW",
        date: "Nov 10, 2024",
        rating: 5,
        title: "Best purchase this year",
        text: "I've been looking for something like this for a while. The craftsmanship is outstanding and it arrived beautifully packaged. Will be a repeat customer.",
        images: [product2],
        helpfulCount: 25,
        commentCount: 1,
        comments: [
            { name: "Emily R.", avatarLetters: "ER", time: "1 week ago", text: "The packaging really is next level!" },
        ],
    },
];

const useProductReviews = (productId: string | undefined) => {
    const [sortBy, setSortBy] = useState("newest");

    const id = Number(productId);
    const reviews = mockReviews[id] || defaultReviews;

    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === "highest") {
            return b.rating - a.rating;
        }
        if (sortBy === "lowest") {
            return a.rating - b.rating;
        }
        if (sortBy === "helpful") {
            return b.helpfulCount - a.helpfulCount;
        }
        return 0;
    });

    return {
        reviews: sortedReviews,
        sortBy,
        setSortBy,
    };
};

export default useProductReviews;
