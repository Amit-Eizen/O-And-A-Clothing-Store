import BaseService from "./baseService";
import commentsModel from "../models/commentsModel";

class CommentsService extends BaseService {
    constructor() {
        super(commentsModel);
    }

    async create(data: any) {
        const comment = await this.model.create(data);
        const populated = await comment.populate("userId", "username profileImage");
        return populated;
    }

    async getCommentsByReviewId(reviewId: string) {
        const comments = await this.model.find({ reviewId }).sort({ createdAt: -1 }).populate('userId', 'username profileImage');
        return comments;
    }

    async getCommentsByUserId(userId: string) {
        const comments = await this.model
            .find({ userId }).sort({ createdAt: -1 })
            .populate('userId', 'username profileImage')
            .populate({
                path: 'reviewId',
                populate: [
                    {path: 'productId', select: 'name images price category'},
                    {path: 'userId', select: 'username profileImage'}
                ]
            });
        return comments;
    }
}

export default new CommentsService();