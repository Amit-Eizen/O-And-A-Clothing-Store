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
        The user is searching for products. Extract search filters from their query.

        Available types: shirts, pants, shoes, jackets, dresses, accessories, t-shirts
        Available categories: men, women, accessories
        Available sizes: XS, S, M, L, XL, XXL

        Return ONLY a valid JSON object with these optional fields:
        - "type": string (one of the available types)
        - "category": string (men, women, or accessories)
        - "color": string (a color)
        - "size": string (one of the available sizes)
        - "minPrice": number
        - "maxPrice": number
        - "tags": string[] (relevant tags like: cotton, casual, summer, formal, winter, sport)
        - "query": string (general search term if no specific filters match)

        Only include fields that are clearly mentioned or implied in the query.
        If the query is not related to clothing, return: {"query": ""}

        User query: "${userQuery}"`;
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

        const mongoFilter: any = {};

        if (filters.type) {
            mongoFilter.type = filters.type;
        }
        if (filters.category) {
            mongoFilter.category = filters.category;
        }
        if (filters.color) {
            mongoFilter.colors = { $regex: filters.color, $options: "i" };
        }
        if (filters.size) {
            mongoFilter.sizes = filters.size;
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
            mongoFilter.$or = [
                { name: { $regex: filters.query, $options: "i" } },
                { description: { $regex: filters.query, $options: "i" } },
            ];
        }

        const products = await productsService.getAll(mongoFilter);
        return products;
    }
}

export default new SearchService();