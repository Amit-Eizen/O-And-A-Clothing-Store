import { Request, Response } from "express";
import searchService from "../services/LLM/searchService";

const smartSearch = async (req: Request, res: Response) => {
    try {
        const query = String(req.query.q || "");
        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }

        const products = await searchService.smartSearch(query);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Smart search failed" });
    }
};

export default {
    smartSearch
};
