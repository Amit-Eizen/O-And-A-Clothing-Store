import { Request, Response } from "express";
import { BaseController } from "./baseController";
import productsService from "../services/productsService";

class ProductsController extends BaseController {
    constructor() {
        super(productsService);
    }

    async getProductsByType(req: Request, res: Response): Promise<void> {
        try {
            const products = await productsService.getProductsByType(String(req.params.type));
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve products by type" });
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

    async getFilteredProducts(req: Request, res: Response): Promise<void> {
        try {
            const query = req.query;
            const params: any = {};

            const paramRules = [
                { name: "category",  type: "string" },
                { name: "sort",      type: "string" },
                { name: "type",      type: "array" },
                { name: "sizes",     type: "array" },
                { name: "colors",    type: "array" },
                { name: "minPrice",  type: "number" },
                { name: "maxPrice",  type: "number" },
                { name: "page",      type: "number" },
                { name: "limit",     type: "number" },
            ];

            for (const rule of paramRules) {
                const value = query[rule.name];
                if (!value) continue;

                if (rule.type === "string") {
                    params[rule.name] = value;
                } else if (rule.type === "array") {
                    params[rule.name] = (value as string).split(",");
                } else if (rule.type === "number") {
                    params[rule.name] = Number(value);
                }
            }

            const result = await productsService.getFilteredProducts(params);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: "Error filtering products" });
        }
    }
}   

export default new ProductsController();