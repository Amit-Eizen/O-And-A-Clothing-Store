import { Request, Response } from "express";
import { BaseController } from "./baseController";
import productsService from "../services/productsService";

class ProductsController extends BaseController {
    constructor() {
        super(productsService);
    }

    async getProductsByCategory(req: Request, res: Response): Promise<void> {
        try {
            const products = await productsService.getProductsByCategory(String(req.params.category));
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve products by category" });
        }
    }

    async searchProducts(req: Request, res: Response): Promise<void> {
        try {
            const query = String(req.query.q || "");
            if (!query) {
                res.status(400).json({ error: "Search query is required" });
                return;
            }
            const products = await productsService.searchProducts(query);
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: "Failed to search products" });
        }
    }
}

export default new ProductsController();