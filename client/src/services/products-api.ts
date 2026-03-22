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
    isFeaturedNewArrival: boolean;
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
    onSale?: boolean;
    newArrivals?: boolean;
    filterByCategories?: string;
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
        { name: "onSale",      type: "boolean" },
        { name: "newArrivals",  type: "boolean" },
        { name: "filterByCategories",   type: "string" },
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
        } else if (rule.type === "boolean") {
            query[rule.name] = String(value);
        }
    }

    const response = await apiClient.get("/products/filter", { params: query });
    return response.data;
};

export function getProductTags(product: ProductFromServer): string[] {
    const tags: string[] = [];

    const hasNewTag = product.tags.some((t) => t.toLowerCase() === "new");
    if (hasNewTag) {
        tags.push("NEW");
    }

    if (product.salePrice) {
        tags.push("SALE");
    }

    return tags;
}

export const fetchNewArrivals = async (limit: number = 4): Promise<ProductFromServer[]> => {
    const response = await apiClient.get("/products/new-arrivals", { params: { limit } });
    return response.data;
};
