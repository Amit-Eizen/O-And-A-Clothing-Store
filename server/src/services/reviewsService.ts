import BaseService from "../services/baseService";
import reviewsModel from "../models/reviewsModel";
import commentsModel from "../models/commentsModel";
import mongoose from "mongoose";

class ReviewsService extends BaseService {
    constructor() {
        super(reviewsModel);
    }

    private async addCommentCounts(reviews: any[]) {
        const reviewIds = reviews.map((r: any) => r._id);
        const commentCounts = await commentsModel.aggregate([
            { $match: { reviewId: { $in: reviewIds } } },
            { $group: { _id: "$reviewId", count: { $sum: 1 } } }
        ]);
        const countMap = new Map(commentCounts.map((c: any) => [c._id.toString(), c.count]));

        return reviews.map((r: any) => ({
            ...r.toObject(),
            commentCount: countMap.get(r._id.toString()) || 0
        }));
    }

    private async findReviews(filter: any, sort: Record<string, 1 | -1>, populateProduct: boolean, skip?: number, limit?: number) {
        let query = this.model
            .find(filter)
            .sort(sort)
            .populate("userId", "username profileImage");

            if(populateProduct) {
                query = query.populate("productId", "name images price category");
            }

            if (skip !== undefined && limit !== undefined) {
                query = query.skip(skip).limit(limit);
            }

            const reviews = await query;
            return this.addCommentCounts(reviews);
    }

    async getById(id: string) {
        const review = await this.findReviews({ _id: id }, { createdAt: -1 }, true);
        if (review.length === 0) return null;
        return review[0];
    }

    async getwithPaging(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const reviews = await this.findReviews({}, { createdAt: -1 }, true, skip, limit);
        const total = await this.model.countDocuments();
        
        return { reviews, total };
    }

    async getByUserId(userId: string) {
        const reviewsByUserId = await this.findReviews({ userId }, { createdAt: -1 }, true);
        return reviewsByUserId;
    }

    private async getProductStatsRating(productId: string) {
        const stats = await this.model.aggregate([
            { $match: { productId: new mongoose.Types.ObjectId(productId) } },
            { 
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    averageRating: { $avg: "$rating" },
                    star1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
                    star2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
                    star3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
                    star4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
                    star5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
                },
            },
        ]);

        if (stats.length === 0) {
            return { total: 0, averageRating: 0, reviewBreakdown: [] };
        }

        const s = stats[0];
        const reviewBreakdown = [5, 4, 3, 2, 1].map((star) => ({
            stars: star,
            percentage: s.total > 0 ? Math.round((s[`star${star}`] / s.total) * 100) : 0,
        }));

        return { total: s.total, averageRating: Math.round(s.averageRating * 10) / 10, reviewBreakdown };
    }

    async getByProductId(productId: string, page: number, limit: number, sort: string) {
        const skip = (page - 1) * limit;

        let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
        if (sort === "highest") sortOption = { rating: -1, _id: 1 };
        if (sort === "lowest") sortOption = { rating: 1, _id: 1 };

        const reviews = await this.findReviews({ productId }, sortOption, false, skip, limit);

        if (sort === "helpful") {
            reviews.sort((a: any, b: any) => b.likes.length - a.likes.length);
        }

        const stats = await this.getProductStatsRating(productId);
        return { reviews, ...stats };
    }

    async toggleLike(reviewId: string, userId: string) {
        const review = await this.model.findById(reviewId);
        if (!review) {
            throw new Error("Review not found");
        }

        const index = review.likes.indexOf(userId);
        if (index === -1) {
            review.likes.push(userId);
        } else {
            review.likes.splice(index, 1);
        }
        await review.save();
        return review;
    }
}

export default new ReviewsService();
