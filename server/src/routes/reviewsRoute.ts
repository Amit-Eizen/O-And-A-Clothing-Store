import express from "express";
import reviewsController from "../controllers/reviewsController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * /reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get all reviews
 *     responses:
 *       200:
 *         description: List of all reviews
 *       500:
 *         description: Server error
 */
router.get("/", reviewsController.getAll.bind(reviewsController));

/**
 * @swagger
 * /reviews/paging:
 *   get:
 *     tags: [Reviews]
 *     summary: Get reviews with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of reviews per page
 *     responses:
 *       200:
 *         description: Paginated reviews with total count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                 total:
 *                   type: integer
 *       500:
 *         description: Server error
 */
router.get("/paging", reviewsController.getwithPaging.bind(reviewsController));

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review found
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.get("/:id", reviewsController.getById.bind(reviewsController));

/**
 * @swagger
 * /reviews/user/{userId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get all reviews by a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user reviews
 *       500:
 *         description: Server error
 */
router.get("/user/:userId", reviewsController.getByUserId.bind(reviewsController));

/**
 * @swagger
 * /reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Create a new review
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - rating
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", authenticate, reviewsController.create.bind(reviewsController));

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     tags: [Reviews]
 *     summary: Update a review
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
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Review updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authenticate, reviewsController.update.bind(reviewsController));

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete a review
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
 *         description: Review deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authenticate, reviewsController.delete.bind(reviewsController));

/**
 * @swagger
 * /reviews/{id}/like:
 *   post:
 *     tags: [Reviews]
 *     summary: Toggle like on a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Like toggled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.post("/:id/like", authenticate, reviewsController.toggleLike.bind(reviewsController));

export default router;
