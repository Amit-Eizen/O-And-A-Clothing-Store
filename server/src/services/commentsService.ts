import BaseService from "./baseService";
import commentsModel from "../models/commentsModel";

class CommentsService extends BaseService {
    constructor() {
        super(commentsModel);
    }

    async getCommentsByReviewId(reviewId: string) {
        const comments = await this.model.find({ reviewId }).sort({ createdAt: -1 }).populate('userId', 'username profileImage');
        return comments;
    }

    async getCommentsByUserId(userId: string) {
        const comments = await this.model
            .find({ userId }).sort({ createdAt: -1 })
            .populate('userId', 'username profileImage')
            .populate('reviewId');

        return comments;
    }
}

export default new CommentsService();