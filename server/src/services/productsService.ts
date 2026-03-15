import BaseService from "./baseService";
import productsModel from "../models/productsModel";
import { SortOrder } from "mongoose";

interface FilterParams {
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

class ProductsService extends BaseService {
    constructor() {
        super(productsModel);
    }

    async getProductsByType(type: string) {
        const products = await this.model.find({ type });
        return products;
    }

    async searchProducts(query: string) {
        const products = await this.model.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                { tags: { $regex: query, $options: "i" } },
            ],
        });
        return products;
    }
    private buildFilter(params: FilterParams) {
        const filter: any = {};

        if (params.category) {
            filter.category = params.category;
        }
        if (params.type && params.type.length > 0) {
            filter.type = { $in: params.type };
        }
        if (params.minPrice !== undefined || params.maxPrice !== undefined) {
            filter.price = {};
            if (params.minPrice !== undefined) {
                filter.price.$gte = params.minPrice;
            }
            if (params.maxPrice !== undefined) {
                filter.price.$lte = params.maxPrice;
            }
        }
        if (params.sizes && params.sizes.length > 0) {
            filter.sizes = { $in: params.sizes };
        }
        if (params.colors && params.colors.length > 0) {
            filter.colors = { $in: params.colors };
        }

        return filter;
    }

    private buildSort(sort?: string): Record<string, SortOrder> {
        if (sort === "price-low") return { price: 1, _id: 1 };
        if (sort === "price-high") return { price: -1, _id: 1 };
        if (sort === "most-popular") return { soldCount: -1, _id: 1 };
        if (sort === "newest") return { createdAt: -1, _id: 1 };
        return {  _id: 1 };
    }

    async getFilteredProducts(params: FilterParams) {
        const filter = this.buildFilter(params);
        const sortObj = this.buildSort(params.sort);

        const page = params.page || 1;
        const limit = params.limit || 8;
        const skip = (page - 1) * limit;

        const total = await this.model.countDocuments(filter);
        const products = await this.model.find(filter).sort(sortObj).skip(skip).limit(limit);

        return { products, total, page, limit };
    }

    async getNewArrivals(limit: number = 4) {
        const featured = await this.model
            .find({ isFeaturedNewArrival: true })
            .sort({ createdAt: -1 })
            .limit(limit);
        
        if (featured.length >= limit) {
            return featured;
        }
    
        const featuredIds = featured.map((p) => p._id);
        const remaining = await this.model
            .find({ _id: { $nin: featuredIds } })
            .sort({ createdAt: -1 })
            .limit(limit - featured.length);
    
        return [...featured, ...remaining];
    }
}

export default new ProductsService();