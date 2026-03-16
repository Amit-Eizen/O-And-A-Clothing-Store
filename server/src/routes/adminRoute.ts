import express from "express";
import adminController from "../controllers/adminController";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware";
import { uploadMediaImages } from "../middleware/uploadMiddleware";

const router = express.Router();

router.use(authenticate, authorizeAdmin);

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Get dashboard statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats (totals, revenue, recent orders)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/stats", adminController.getDashboardStats);

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     tags: [Admin]
 *     summary: Get all orders (paginated, filterable by status)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *         description: Filter by order status
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/orders", adminController.getAllOrders);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users (paginated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/users", adminController.getAllUsers);

/**
 * @swagger
 * /admin/products:
 *   get:
 *     tags: [Admin]
 *     summary: Get all products (paginated, sortable)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, price-asc, price-desc, name-asc, name-desc, stock-asc, stock-desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Paginated list of products
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/products", adminController.getAllProducts);

/**
 * @swagger
 * /admin/products:
 *   post:
 *     tags: [Admin]
 *     summary: Create a new product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type, description, price, category, stock]
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *                 enum: [men, women, accessories]
 *               stock:
 *                 type: number
 *     responses:
 *       201:
 *         description: Created product
 *       400:
 *         description: Validation error
 */
router.post("/products", adminController.createProduct);

/**
 * @swagger
 * /admin/low-stock:
 *   get:
 *     tags: [Admin]
 *     summary: Get products with low stock
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: number
 *           default: 5
 *         description: Stock threshold
 *     responses:
 *       200:
 *         description: List of low stock products
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/low-stock", adminController.getLowStockProducts);

/**
 * @swagger
 * /admin/media-library:
 *   get:
 *     tags: [Admin]
 *     summary: Get all product images from the media library
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all available product images
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/media-library", adminController.getMediaLibrary);

/**
 * @swagger
 * /admin/replace-banner:
 *   put:
 *     tags: [Admin]
 *     summary: Replace a site banner image with another image
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetPath:
 *                 type: string
 *                 description: Path of the banner to replace (hero/categories only)
 *               sourcePath:
 *                 type: string
 *                 description: Path of the source image to copy from
 *     responses:
 *       200:
 *         description: Banner replaced
 *       400:
 *         description: Invalid target path
 *       404:
 *         description: Source not found
 */
router.put("/replace-banner", adminController.replaceBanner);

/**
 * @swagger
 * /admin/upload-media:
 *   post:
 *     tags: [Admin]
 *     summary: Upload images to the media library
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               category:
 *                 type: string
 *                 description: Target category folder (Women, Men, Accessories)
 *     responses:
 *       201:
 *         description: Uploaded images
 *       400:
 *         description: No files uploaded
 */
router.post("/upload-media", uploadMediaImages, adminController.uploadMedia);

/**
 * @swagger
 * /admin/products/{id}/featured:
 *   put:
 *     tags: [Admin]
 *     summary: Toggle product new arrival status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Updated product
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product not found
 */
router.put("/products/:id/featured", adminController.toggleNewArrival);

/**
 * @swagger
 * /admin/orders/{id}/status:
 *   put:
 *     tags: [Admin]
 *     summary: Update order status
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
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Updated order
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Order not found
 */
router.put("/orders/:id/status", adminController.updateOrderStatus);

/**
 * @swagger
 * /admin/products/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update product
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
 *         description: Updated product
 *       404:
 *         description: Product not found
 */
router.put("/products/:id", adminController.updateProduct);

/**
 * @swagger
 * /admin/products/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete product
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
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete("/products/:id", adminController.deleteProduct);

export default router;
