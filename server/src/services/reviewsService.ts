import BaseService from "../services/baseService";
import reviewsModel from "../models/reviewsModel";
import commentsModel from "../models/commentsModel";

class ReviewsService extends BaseService {
    constructor() {
        super(reviewsModel);
    }

    async getById(id: string) {
        const review = await this.model
            .findById(id)
            .populate("userId", "username profileImage");
        if (!review) return null;

        const commentCount = await commentsModel.countDocuments({ reviewId: id });
        return { ...review.toObject(), commentCount };
    }

    async getwithPaging(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const reviews = await this.model
            .find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("userId", "username profileImage");
        const total = await this.model.countDocuments();

        const reviewIds = reviews.map((r: any) => r._id);
        const commentCounts = await commentsModel.aggregate([
            { $match: { reviewId: { $in: reviewIds } } },
            { $group: { _id: "$reviewId", count: { $sum: 1 } } }
        ]);
        const countMap = new Map(commentCounts.map((c: any) => [c._id.toString(), c.count]));

        const reviewsWithCount = reviews.map((r: any) => ({
            ...r.toObject(),
            commentCount: countMap.get(r._id.toString()) || 0
        }));

        return { reviews: reviewsWithCount, total };
    }

    async getByUserId(userId: string) {
        const reviews = await this.model.find({ userId })
            .sort({ createdAt: -1 })
            .populate("userId", "username profileImage");

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