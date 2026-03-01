import BaseService from "./baseService";
import commentsModel from "../models/commentsModel";

class CommentsService extends BaseService {
    constructor() {
        super(commentsModel);
    }

    async getCommentsByReviewId(reviewId: string) {
        const comments = await this.model.find({ reviewId }).sort({ createdAt: -1 }).populate('userId', 'username profilePicture');
        return comments;
    }
}

export default new CommentsService();