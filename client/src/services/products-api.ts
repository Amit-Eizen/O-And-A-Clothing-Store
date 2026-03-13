import apiClient from "./api-client";

export interface ProductFromServer {
    _id: string;
    name: string;
    type: string;
    description: string;
    price: number;
    salePrice?: number;
    category: "men" | "women" | "accessories";
    sizes: string[];
    colors: string[];
    images: string[];
    stock: number;
    soldCount: number;
    tags: string[];
    features: string[];
    createdAt: string;
}

interface FilterProductsResponse {
    products: ProductFromServer[];
    total: number;
    page: number;
    limit: number;
}

interface FilterProductsParams {
    category?: string;
    type?: string[];
    minPrice?: number;
    maxPrice?: number;
    sizes?: string[];
    colors?: string[];
    sort?: string;
    page?: number;
    limit?: number;
}

export const fetchFilteredProducts = async (params: FilterProductsParams): Promise<FilterProductsResponse> => {
    const query: Record<string, string> = {};

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
        const value = (params as any)[rule.name];
        if (value === undefined || value === null) continue;

        if (rule.type === "string") {
            query[rule.name] = value;
        } else if (rule.type === "array" &&  value.length > 0) {
            query[rule.name] = value.join(",");
        } else if (rule.type === "number") {
            query[rule.name] = String(value);
        }
    }

    const response = await apiClient.get("/products/filter", { params: query });
    return response.data;
};

export function getProductTags(product: ProductFromServer): string[] {
    const tags: string[] = [];

    const towWeeksAgo = new Date();
    towWeeksAgo.setDate(towWeeksAgo.getDate() - 14);
    if( new Date(product.createdAt) > towWeeksAgo) {
        tags.push("NEW");
    }

    if (product.salePrice) {
        tags.push("SALE");
    }

    return tags;
}