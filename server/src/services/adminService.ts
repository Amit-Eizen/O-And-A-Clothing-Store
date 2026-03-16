import userModel from "../models/userModel";
import productsModel from "../models/productsModel";
import ordersModel from "../models/ordersModel";

interface PagingParams {
    page?: number;
    limit?: number;
}

interface OrderFilterParams extends PagingParams {
    status?: string;
}

interface ProductFilterParams extends PagingParams {
    sort?: string;
}

interface PagingResult {
    page: number;
    limit: number;
    skip: number;
}

interface DashboardStats {
    totalProducts: number;
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    recentOrders: any[];
}

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

class AdminService {

    private getPaging(params: PagingParams): PagingResult {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;
        return { page, limit, skip };
    }

    async getDashboardStats(): Promise<DashboardStats> {
        const [totalProducts, totalUsers, totalOrders, revenueResult, recentOrders] = await Promise.all([
            productsModel.countDocuments(),
            userModel.countDocuments(),
            ordersModel.countDocuments(),
            ordersModel.aggregate([
                { $match: { status: { $ne: "cancelled" } } },
                { $group: { _id: null, total: { $sum: "$totalPrice" } } }
            ]),
            ordersModel
                .find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate("userId", "username email")
        ]);

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        return { totalProducts, totalUsers, totalOrders, totalRevenue, recentOrders };
    }

    async getAllOrders(params: OrderFilterParams): Promise<PaginatedResponse<any>> {
        const filter: any = {};
        if (params.status) {
            filter.status = params.status;
        }

        const { page, limit, skip } = this.getPaging(params);

        const [total, orders] = await Promise.all([
            ordersModel.countDocuments(filter),
            ordersModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("userId", "username email")
                .populate("items.productId", "name images")
        ]);

        return { data: orders, total, page, limit };
    }

    async getAllUsers(params: PagingParams): Promise<PaginatedResponse<any>> {
        const { page, limit, skip } = this.getPaging(params);

        const [total, users] = await Promise.all([
            userModel.countDocuments(),
            userModel
                .find()
                .select("-password -refreshToken")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
        ]);

        return { data: users, total, page, limit };
    }

    async getAllProducts(params: ProductFilterParams): Promise<PaginatedResponse<any>> {
        const { page, limit, skip } = this.getPaging(params);

        const sortOptions: Record<string, any> = {
            newest: { createdAt: -1, _id: -1 },
            oldest: { createdAt: 1, _id: 1 },
            "price-asc": { price: 1, _id: 1 },
            "price-desc": { price: -1, _id: -1 },
            "name-asc": { name: 1, _id: 1 },
            "name-desc": { name: -1, _id: -1 },
            "stock-asc": { stock: 1, _id: 1 },
            "stock-desc": { stock: -1, _id: -1 },
        };
        const sort = sortOptions[params.sort || "newest"] || { createdAt: -1, _id: -1 };

        const [total, products] = await Promise.all([
            productsModel.countDocuments(),
            productsModel.find().sort(sort).skip(skip).limit(limit)
        ]);
        return { data: products, total, page, limit };
    }

    async createProduct(data: any) {
        const product = await productsModel.create(data);
        return product;
    }
    
    async getLowStockProducts(threshold: number = 5) {
        const products = await productsModel
            .find({ stock: { $lte: threshold } })
            .sort({ stock: 1 });
        return products;
    }

    async toggleNewArrival(productId: string) {
        const product = await productsModel.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        product.isFeaturedNewArrival = !product.isFeaturedNewArrival;
        await product.save();
        return product;
    }

    async updateOrderStatus(orderId: string, status: string) {
        const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            throw new Error("Invalid status");
        }

        const order = await ordersModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate("userId", "username email");

        if (!order) {
            throw new Error("Order not found");
        }
        return order;
    }

    async updateProduct(productId: string, updates: any) {
        const product = await productsModel.findByIdAndUpdate(
            productId,
            updates,
            { new: true }
        );
        if (!product) {
            throw new Error("Product not found");
        }
        return product;
    }

    async deleteProduct(productId: string) {
        const product = await productsModel.findByIdAndDelete(productId);
        if (!product) {
            throw new Error("Product not found");
        }
        return product;
    }
}

export default new AdminService();