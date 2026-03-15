import { useState, useEffect, useCallback } from "react";
import { fetchProductReviews } from "../services/reviews-api";
import type { ReviewFromServer, ReviewBreakdownItem } from "../services/reviews-api";
import { getAvatarLetters, formatDate, getImageUrl } from "../utils/format";

interface Review {
    id: string;
    name: string;
    avatarLetters: string;
    date: string;
    rating: number;
    title: string;
    text: string;
    images: string[];
    helpfulCount: number;
    commentCount: number;
    likedByUser: string[];
    userId: string;
}

const mapReview = (review: ReviewFromServer): Review => {
    return {
        id: review._id,
        name: review.userId.username,
        avatarLetters: getAvatarLetters(review.userId.username),
        date: formatDate(review.createdAt),
        rating: review.rating,
        title: review.title,
        text: review.content,
        images: review.images.map((img) => getImageUrl(img)),
        helpfulCount: review.likes.length,
        commentCount: review.commentCount,
        likedByUser: review.likes,
        userId: review.userId._id,
    };
};

const useProductReviews = (productId: string | undefined) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("newest");
    const [averageRating, setAverageRating] = useState(0);
    const [total, setTotal] = useState(0);
    const [reviewBreakdown, setReviewBreakdown] = useState<ReviewBreakdownItem[]>([]);

    const loadReviews = useCallback(async () => {
        if (!productId) return;

        setLoading(true);
        try {
            const data = await fetchProductReviews(productId, 1, 10, sortBy);
            setReviews(data.reviews.map(mapReview));
            setTotal(data.total);
            setAverageRating(data.averageRating);
            setReviewBreakdown(data.reviewBreakdown);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    }, [productId, sortBy]);

    useEffect(() => {
        loadReviews();
    }, [loadReviews]);

    return { 
        reviews, 
        loading, 
        sortBy,
        setSortBy,
        averageRating,
        total,
        reviewBreakdown,
        reloadReviews: loadReviews,
    };
};

export default useProductReviews;