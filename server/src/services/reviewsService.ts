import BaseService from "../services/baseService";
import reviewsModel from "../models/reviewsModel";

class ReviewsService extends BaseService {
    constructor() {
        super(reviewsModel);
    }

    async getById(id: string) {
        return this.model
            .findById(id)
            .populate("userId", "username profileImage");
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
        return { reviews, total };
    }

    async getByUserId(userId: string) {
        return await this.model.find({ userId })
            .sort({ createdAt: -1 })
            .populate("userId", "username profileImage");
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