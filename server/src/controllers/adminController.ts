import { Request, Response } from "express";
import adminService from "../services/adminService";
import path from "path";
import fs from "fs";

const paramRules = [
    { name: "status", type: "string" },
    { name: "page",   type: "number" },
    { name: "limit",  type: "number" },
];

function parseQueryParams(query: any, rules: typeof paramRules): any {
    const params: any = {};

    for (const rule of rules) {
        const value = query[rule.name];
        if (!value) continue;

        if (rule.type === "string") {
            params[rule.name] = value;
        } else if (rule.type === "number") { 
            params[rule.name] = Number(value);
        }
    }

    return params;
}

const adminController = {
    async getDashboardStats(req: Request, res: Response): Promise<void> {
        try {
            const stats = await adminService.getDashboardStats();
            res.status(200).json(stats);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch dashboard stats" });
        }
    },

    async getAllOrders(req: Request, res: Response): Promise<void> {
        try {
            const params = parseQueryParams(req.query, paramRules);
            const result = await adminService.getAllOrders(params);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch orders" });
        }
    },

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const params = parseQueryParams(req.query, paramRules);
            const result = await adminService.getAllUsers(params);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch users" });
        }
    },

    async getAllProducts(req: Request, res: Response): Promise<void> {
        try {
            const params = parseQueryParams(req.query, [
                { name: "page", type: "number" },
                { name: "limit", type: "number" },
                { name: "sort", type: "string" },
            ]);
            const result = await adminService.getAllProducts(params);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch products" });
        }
    },

    async createProduct(req: Request, res: Response): Promise<void> {
        try {
            const product = await adminService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error: any) {
            res.status(400).json({ error: error.message || "Failed to create product" });
        }
    },

    async getLowStockProducts(req: Request, res: Response): Promise<void> {
        try {
            const threshold = Number(req.query.threshold) || 5;
            const products = await adminService.getLowStockProducts(threshold);
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch low stock products" });
        }
    },

    async toggleNewArrival(req: Request, res: Response): Promise<void> {
        try {
            const product = await adminService.toggleNewArrival(String(req.params.id));
            res.status(200).json(product);
        } catch (error) {
            res.status(404).json({ error: "Product not found" });
        }
    },

    async updateOrderStatus(req: Request, res: Response): Promise<void> {
        try {
            const order = await adminService.updateOrderStatus(String(req.params.id), req.body.status);
            res.status(200).json(order);
        } catch (error: any) {
            if (error.message === "Invalid status") {
                res.status(400).json({ error: error.message });
            } else if (error.message === "Order not found") {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Failed to update order status" });
            }
        }
    },

    async updateProduct(req: Request, res: Response): Promise<void> {
        try {
            const product = await adminService.updateProduct(String(req.params.id), req.body);
            res.status(200).json(product);
        } catch (error) {
            res.status(404).json({ error: "Product not found" });
        }
    },

    async deleteProduct(req: Request, res: Response): Promise<void> {
        try {
            await adminService.deleteProduct(String(req.params.id));
            res.status(200).json({ message: "Product deleted" });
        } catch (error) {
            res.status(404).json({ error: "Product not found" });
        }
    },

    async getMediaLibrary(req: Request, res: Response): Promise<void> {
        try {
            const baseDir = path.join(__dirname, "../../public/images");
            const images: { path: string; category: string; filename: string }[] = [];

            const scanDir = (dir: string, category: string) => {
                if (!fs.existsSync(dir)) return;
                const files = fs.readdirSync(dir);
                for (const file of files) {
                    const filePath = path.join(dir, file);
                    if (fs.statSync(filePath).isDirectory()) continue;
                    const ext = path.extname(file).toLowerCase();
                    if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
                        const relativePath = `/public/images/${path.relative(baseDir, filePath).replace(/\\/g, "/")}`;
                        images.push({ path: relativePath, category, filename: file });
                    }
                }
            };

            // Scan product folders
            const productsDir = path.join(baseDir, "products");
            if (fs.existsSync(productsDir)) {
                for (const folder of fs.readdirSync(productsDir)) {
                    const folderPath = path.join(productsDir, folder);
                    if (fs.statSync(folderPath).isDirectory()) {
                        scanDir(folderPath, folder);
                    }
                }
            }

            // Scan hero & categories folders
            scanDir(path.join(baseDir, "hero"), "Banners");
            scanDir(path.join(baseDir, "categories"), "Categories");

            res.status(200).json(images);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch media library" });
        }
    },

    async replaceBanner(req: Request, res: Response): Promise<void> {
        try {
            const { targetPath, sourcePath } = req.body;

            // Validate paths — only allow replacing files in hero/ or categories/
            const allowedPrefixes = ["/public/images/hero/", "/public/images/categories/"];
            const isAllowed = allowedPrefixes.some((prefix) => targetPath.startsWith(prefix));
            if (!isAllowed) {
                res.status(400).json({ error: "Cannot replace files outside hero/categories folders" });
                return;
            }

            const baseDir = path.join(__dirname, "../../");
            const source = path.join(baseDir, sourcePath);
            const target = path.join(baseDir, targetPath);

            if (!fs.existsSync(source)) {
                res.status(404).json({ error: "Source image not found" });
                return;
            }

            fs.copyFileSync(source, target);
            res.status(200).json({ message: "Banner replaced successfully" });
        } catch (error) {
            res.status(500).json({ error: "Failed to replace banner" });
        }
    },

    async uploadMedia(req: Request, res: Response): Promise<void> {
        try {
            const files = req.files as Express.Multer.File[];
            if (!files || files.length === 0) {
                res.status(400).json({ error: "No files uploaded" });
                return;
            }

            const category = req.body.category || "Uncategorized";
            const uploaded = files.map((file) => ({
                path: `/public/images/products/${category}/${file.filename}`,
                category,
                filename: file.filename,
            }));

            res.status(201).json(uploaded);
        } catch (error) {
            res.status(500).json({ error: "Failed to upload images" });
        }
    },
};

export default adminController;