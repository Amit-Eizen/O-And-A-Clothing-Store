import { Request, Response } from "express";
import { BaseController } from "./baseController";
import commentsService from "../services/commentsService";
import { AuthRequest } from "../middleware/authMiddleware";

class CommentsController extends BaseController {
    constructor() {
        super(commentsService);
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const commentData = {
                ...req.body,
                userId: (req as AuthRequest).userId
            };
            const newComment = await this.service.create(commentData);
            res.status(201).json(newComment);
        } catch (error) {
            res.status(500).json({ error: "Failed to create comment" });
        }
    }

    async getCommentsByReviewId(req: Request, res: Response): Promise<void> {
        try {
            const comments = await commentsService.getCommentsByReviewId(String(req.params.reviewId));
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve comments" });
        }
    }
}

export default new CommentsController();
