import express from "express";
import commentsController from "../controllers/commentsControllers";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * /comments/review/{reviewId}:
 *   get:
 *     tags: [Comments]
 *     summary: Get all comments for a review
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: List of comments for the review
 *       500:
 *         description: Server error
 */
router.get("/review/:reviewId", commentsController.getCommentsByReviewId.bind(commentsController));

/**
 * @swagger
 * /comments/user:
 *   get:
 *     tags: [Comments]
 *     summary: Get all comments by the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's comments with review details
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/user", authenticate, commentsController.getCommentsByUserId.bind(commentsController));

/**
 * @swagger
 * /comments:
 *   post:
 *     tags: [Comments]
 *     summary: Create a new comment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reviewId
 *               - content
 *             properties:
 *               reviewId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", authenticate, commentsController.create.bind(commentsController));

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     tags: [Comments]
 *     summary: Update a comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authenticate, commentsController.update.bind(commentsController));

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     tags: [Comments]
 *     summary: Delete a comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authenticate, commentsController.delete.bind(commentsController));

export default router;
