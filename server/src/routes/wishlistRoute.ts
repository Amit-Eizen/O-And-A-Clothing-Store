import express from "express";
import wishlistController from "../controllers/wishlistController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Wishlist management
 */

/**
 * @swagger
 * /wishlist:
 *   get:
 *     tags: [Wishlist]
 *     summary: Get user's wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's wishlist with populated products
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, wishlistController.getWishlist);

/**
 * @swagger
 * /wishlist:
 *   post:
 *     tags: [Wishlist]
 *     summary: Add product to wishlist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product added to wishlist
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticate, wishlistController.addToWishlist);

/**
 * @swagger
 * /wishlist/{productId}:
 *   delete:
 *     tags: [Wishlist]
 *     summary: Remove product from wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wishlist not found
 */
router.delete("/:productId", authenticate, wishlistController.removeFromWishlist);

export default router;
