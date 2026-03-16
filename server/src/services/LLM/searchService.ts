import llmService from "./llmService";
import productsService from "../productsService";

interface SearchFilters {
    type?: string;
    category?: string;
    color?: string;
    size?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
    query?: string;
}

class SearchService {
    private buildPrompt(userQuery: string): string {
        return `You are a search assistant for a clothing store called O&A.
        Extract search filters from the user's query. Be creative — infer what types of clothing fit the occasion.

        Available product types: Dresses, Sets, Blouses, Skirts, Pants, Jeans, Coats, Blazers, Jackets, Polo Shirts, T-Shirts, Sweaters, Hoodies, Sweatshirts, Sunglasses, Scarves, Bags, Jewelry, Shoes, Wallets, Hats
        Available categories: men, women, accessories
        Available sizes: XS, S, M, L, XL, XXL

        Return ONLY a valid JSON object with these optional fields:
        - "type": string (one of the available types, pick the most relevant one)
        - "category": string (men, women, or accessories)
        - "color": string (a color)
        - "size": string (one of the available sizes)
        - "minPrice": number
        - "maxPrice": number
        - "tags": string[] (relevant tags like: cotton, casual, summer, formal, winter, sport, elegant, evening, date)
        - "query": string (a SHORT 1-2 word search term to match product names/descriptions — NOT the full user query)

        IMPORTANT RULES:
        - Try to extract specific filters (type, category, tags) rather than relying on "query"
        - For occasion-based queries like "date night" or "summer vacation", use tags and/or type
        - "query" should only be a short keyword, never the full user sentence
        - Only include fields that are relevant
        - If the query is not related to clothing/fashion, return: {"query": ""}

        User query: "${userQuery}"`;
    }

    private buildMongoFilter(filters: SearchFilters): any {
        const mongoFilter: any = {};

        if (filters.type) {
            mongoFilter.type = { $regex: filters.type, $options: "i" };
        }
        if (filters.category) {
            mongoFilter.category = filters.category.toLowerCase();
        }
        if (filters.color) {
            mongoFilter.colors = { $regex: filters.color, $options: "i" };
        }
        if (filters.size) {
            mongoFilter.sizes = { $regex: `^${filters.size}$`, $options: "i" };
        }
        if (filters.minPrice || filters.maxPrice) {
            mongoFilter.price = {};
            if (filters.minPrice) mongoFilter.price.$gte = filters.minPrice;
            if (filters.maxPrice) mongoFilter.price.$lte = filters.maxPrice;
        }
        if (filters.tags && filters.tags.length > 0) {
            mongoFilter.tags = { $in: filters.tags.map(t => new RegExp(t, "i")) };
        }
        if (filters.query) {
            const words = filters.query.trim().split(/\s+/);
            const pattern = words.join("|");
            mongoFilter.$or = [
                { name: { $regex: pattern, $options: "i" } },
                { description: { $regex: pattern, $options: "i" } },
            ];
        }

        return mongoFilter;
    }

    async smartSearch(userQuery: string): Promise<any[]> {
        const prompt = this.buildPrompt(userQuery);
        const llmResponse = await llmService.generateResponse(prompt);

        let filters: SearchFilters;
        try {
            filters = JSON.parse(llmResponse);
        } catch {
            return productsService.searchProducts(userQuery);
        }

        if (filters.query === "") {
            return [];
        }

        const mongoFilter = this.buildMongoFilter(filters);
        let products = await productsService.getAll(mongoFilter);

        // If strict filter returns 0, try without tags
        if (products.length === 0 && filters.tags && filters.tags.length > 0) {
            const relaxed = { ...filters };
            delete relaxed.tags;
            const relaxedFilter = this.buildMongoFilter(relaxed);
            products = await productsService.getAll(relaxedFilter);
        }

        // If still 0, try with just query in name/description (broadest search)
        if (products.length === 0 && filters.query) {
            const words = filters.query.trim().split(/\s+/);
            const pattern = words.join("|");
            const broadFilter: any = {
                $or: [
                    { name: { $regex: pattern, $options: "i" } },
                    { description: { $regex: pattern, $options: "i" } },
                    { tags: { $in: words.map(w => new RegExp(w, "i")) } },
                ],
            };
            if (filters.category) {
                broadFilter.category = filters.category.toLowerCase();
            }
            products = await productsService.getAll(broadFilter);
        }

        return products;
    }
}

export default new SearchService();