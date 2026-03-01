import {Request, Response} from "express";
import { BaseController } from "./baseController";
import reviewsService from "../services/reviewsService";
import { AuthRequest } from "../middleware/authMiddleware";

class ReviewsController extends BaseController {
    constructor() {
        super(reviewsService);
    }

    async create(req: AuthRequest, res: Response): Promise<void> {
        try {
            const reviewData = 
                {
                    ...req.body,
                    userId: req.userId
                };
            const newReview = await reviewsService.create(reviewData);
            res.status(201).json(newReview);
        } catch (error) {
            res.status(500).json({ error: "Error creating review" });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const review = await reviewsService.getById(String(req.params.id));
            if (!review) {
                res.status(404).json({ message: "Review not found" });
                return;
            }
            res.status(200).json(review);
        } catch (error) {
            res.status(500).json({ error: "Error retrieving review" });
        }
    }

    async getwithPaging(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(String(req.query.page)) || 1;
            const limit = parseInt(String(req.query.limit)) || 10;
            const result = await reviewsService.getwithPaging(page, limit);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: "Error retrieving reviews with paging" });
        }
    }

    async getByUserId(req: Request, res: Response): Promise<void> {
        try {
            const reviews = await reviewsService.getByUserId(String(req.params.userId));
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ error: "Error retrieving reviews by user ID" });
        }  
    }

    async toggleLike(req: AuthRequest, res: Response): Promise<void> {
        try {
            const review = await reviewsService.toggleLike(String(req.params.id), req.userId!);
            res.status(200).json(review);
        } catch (error: any) {
            if (error.message === "Review not found") {
                res.status(404).json({ message: "Review not found" });
                return;
            } 
            res.status(500).json({ error: "Error toggling like" });
        }
    }
}

export default new ReviewsController();