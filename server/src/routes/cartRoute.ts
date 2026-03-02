import express from "express";
import cartController from "../controllers/cartController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * /cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get user's cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", authenticate, cartController.getCartByUserId);

/**
 * @swagger
 * /cart/items:
 *   post:
 *     tags: [Cart]
 *     summary: Add item to cart
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
 *               - quantity
 *               - size
 *               - color
 *               - price
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *               size:
 *                 type: string
 *               color:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item added to cart
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/items", authenticate, cartController.addItemToCart);

/**
 * @swagger
 * /cart/items/{itemId}:
 *   put:
 *     tags: [Cart]
 *     summary: Update item quantity
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item quantity updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart or item not found
 *       500:
 *         description: Server error
 */
router.put("/items/:itemId", authenticate, cartController.updateItemQuantity);

/**
 * @swagger
 * /cart/items/{itemId}:
 *   delete:
 *     tags: [Cart]
 *     summary: Remove item from cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart or item not found
 *       500:
 *         description: Server error
 */
router.delete("/items/:itemId", authenticate, cartController.removeItemFromCart);

/**
 * @swagger
 * /cart:
 *   delete:
 *     tags: [Cart]
 *     summary: Clear entire cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/", authenticate, cartController.clearCart);

export default router;