import BaseService from "./baseService";
import productsModel from "../models/productsModel";

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
}

export default new ProductsService();