import apiClient from "./api-client";

export interface ReviewUser {
    _id: string;
    username: string;
    profileImage: string;
}

export interface ReviewFromServer {
    _id: string;
    userId: ReviewUser;
    productId: string;
    title: string;
    content: string;
    rating: number;
    images: string[];
    likes: string[]; 
    commentCount: number;
    createdAt: string;
}

export interface ReviewBreakdownItem {
    stars: number;
    percentage: number;
}

export interface ProductReviewsResponse {
    reviews: ReviewFromServer[];
    total: number;
    averageRating: number;
    reviewBreakdown: ReviewBreakdownItem[];
}

export interface CommentFromServer {
    _id: string;
    userId: ReviewUser;
    reviewId: string;
    content: string;
    createdAt: string;
}

export const fetchProductReviews = async (productId: string, page: number, limit: number, sort: string): Promise<ProductReviewsResponse> => {
    const response = await apiClient.get(`/reviews/product/${productId}`, {
        params: { page, limit, sort },
    });
    return response.data;
};

export const toggleReviewLike = async (reviewId: string): Promise<void> => {
    await apiClient.post(`/reviews/${reviewId}/like`);
};

export const fetchReviewComments = async (reviewId: string): Promise<CommentFromServer[]> => {
    const response = await apiClient.get(`/comments/review/${reviewId}`);
    return response.data;
};

export const postComment = async (reviewId: string, content: string): Promise<CommentFromServer> => {
    const response = await apiClient.post("/comments", { reviewId, content });
    return response.data;
};

export const deleteReview = async (reviewId: string): Promise<void> => {
    await apiClient.delete(`/reviews/${reviewId}`);
};

export const updateReview = async (reviewId: string, data: { title?: string; content?: string; rating?: number; images?: string[] }): Promise<void> => {
    await apiClient.put(`/reviews/${reviewId}`, data);
};

export const deleteComment = async (commentId: string): Promise<void> => {
    await apiClient.delete(`/comments/${commentId}`);
};

export const updateComment = async (commentId: string, content: string): Promise<void> => {
    await apiClient.put(`/comments/${commentId}`, { content });
};

export const createReview = async (productId: string, title: string, content: string, rating: number, images?: File[]): Promise<ReviewFromServer> => {
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("rating", String(rating));

    if (images) {
        for (const image of images) {
            formData.append("images", image);
        }
    }

    const response = await apiClient.post("/reviews", formData);
    return response.data;
};

