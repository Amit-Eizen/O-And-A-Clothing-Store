import { Request, Response } from "express";
import { BaseController } from "./baseController";
import commentsService from "../services/commentsService";
import { AuthRequest } from "../middleware/authMiddleware";

class CommentsController extends BaseController {
    constructor() {
        super(commentsService);
    }

    async create(req: AuthRequest, res: Response): Promise<void> {
        try {
            const commentData = {
                ...req.body,
                userId: req.userId
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

    async getCommentsByUserId(req: AuthRequest, res: Response): Promise<void> {
        try {
            const comments = await commentsService.getCommentsByUserId(req.userId!);
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve comments" });
        }
    }

    async update(req: AuthRequest, res: Response): Promise<void> {
        try {
            const comment = await commentsService.getById(String(req.params.id));
            if (!comment) {
                res.status(404).json({ message: "Comment not found" });
                return;
            }

            if (comment.userId.toString() !== req.userId) {
                res.status(403).json({ message: "Unauthorized to update this comment" });
                return;
            }

            const updatedComment = await commentsService.update(String(req.params.id), { content: req.body.content });
            res.status(200).json(updatedComment);
        } catch (error) {
            res.status(500).json({ error: "Error updating comment" });
        }
    }

    async delete(req: AuthRequest, res: Response): Promise<void> {
        try {
            const comment = await commentsService.getById(String(req.params.id));
            if (!comment) {
                res.status(404).json({ message: "Comment not found" });
                return;
            }

            if (comment.userId.toString() !== req.userId) {
                res.status(403).json({ message: "Unauthorized to delete this comment" });
                return;
            }

            await commentsService.delete(String(req.params.id));
            res.status(200).json({ message: "Comment deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: "Error deleting comment" });
        }
    }
}

export default new CommentsController();
