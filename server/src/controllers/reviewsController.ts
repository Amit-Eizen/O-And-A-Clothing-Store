import {Request, Response} from "express";
import { BaseController } from "./baseController";
import reviewsService from "../services/reviewsService";
import { AuthRequest } from "../middleware/authMiddleware";
import { UPLOADS_PATH } from "../middleware/uploadMiddleware";
import ordersModel from "../models/ordersModel";
import commentsModel from "../models/commentsModel";

class ReviewsController extends BaseController {
    constructor() {
        super(reviewsService);
    }

    async create(req: AuthRequest, res: Response): Promise<void> {
        try {
            // Check if user purchased this product
            const hasPurchased = await ordersModel.exists({
                userId: req.userId,
                "items.productId": req.body.productId,
                status: { $in: ["processing", "shipped", "delivered"] }
            });

            if (!hasPurchased) {
                res.status(403).json({ message: "You can only review products you have purchased" });
                return;
            }

            // Check if user already reviewed this product
            const alreadyReviewed = await reviewsService.model.exists({
                userId: req.userId,
                productId: req.body.productId
            });

            if (alreadyReviewed) {
                res.status(409).json({ message: "You have already reviewed this product" });
                return;
            }

            const images: string[] = [];
            if (req.files && Array.isArray(req.files)) {
                for (const file of req.files) {
                    images.push(`${UPLOADS_PATH}/${req.userId}/reviews/${file.filename}`);
                }
            }

            const reviewData = {
                ...req.body,
                userId: req.userId,
                images
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

    async getWithPaging(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(String(req.query.page)) || 1;
            const limit = parseInt(String(req.query.limit)) || 10;
            const result = await reviewsService.getWithPaging(page, limit);
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

    async getByProductId(req: Request, res: Response): Promise<void> {
        try {
            const productId = String(req.params.productId);
            const page = parseInt(String(req.query.page)) || 1;
            const limit = parseInt(String(req.query.limit)) || 10;
            const sort = String(req.query.sort) || "newest";

            const result = await reviewsService.getByProductId(productId, page, limit, sort);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: "Error retrieving reviews by product ID" });
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

    async update(req: AuthRequest, res: Response): Promise<void> {
        try {
            const review = await reviewsService.getById(String(req.params.id));
            if (!review) {
                res.status(404).json({ message: "Review not found" });
                return;
            }

            if (review.userId._id.toString() !== req.userId) {
                res.status(403).json({ message: "Unauthorized to update this review" });
                return;
            }

            const images: string[] = [...(review.images || [])];
            if (req.files && Array.isArray(req.files)) {
                for (const file of req.files) {
                    images.push(`${UPLOADS_PATH}/${req.userId}/reviews/${file.filename}`);
                }
            }

            if (req.body.images) {
                const keepImages: string[] = JSON.parse(req.body.images);
                images.length = 0; 
                images.push(...keepImages);
                if (req.files && Array.isArray(req.files)) {
                    for (const file of req.files) {
                        images.push(`${UPLOADS_PATH}/${req.userId}/reviews/${file.filename}`);
                    }
                }
            }

            const updatedData = {
                ...req.body,
                images
            };
            delete updatedData.userId;

            const updatedReview = await reviewsService.update(String(req.params.id), updatedData);
            res.status(200).json(updatedReview);
        } catch (error) {
            res.status(500).json({ error: "Error updating review" });
        }
    }

    async delete(req: AuthRequest, res: Response): Promise<void> {
        try {
            const review = await reviewsService.getById(String(req.params.id));
            if (!review) {
                res.status(404).json({ message: "Review not found" });
                return;
            }

            if (review.userId._id.toString() !== req.userId) {
                res.status(403).json({ message: "Unauthorized to delete this review" });
                return;
            }

            await commentsModel.deleteMany({ reviewId: req.params.id });
            await reviewsService.delete(String(req.params.id));
            res.status(200).json({ message: "Review deleted successfully" });
            } catch (error) {
            res.status(500).json({ error: "Error deleting review" });
        }
    }
}

export default new ReviewsController();