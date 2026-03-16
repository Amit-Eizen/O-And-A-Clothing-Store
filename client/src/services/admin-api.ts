import apiClient from "./api-client";
import type { ProductFromServer } from "./products-api";

export interface DashboardStats {
    totalProducts: number;
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    recentOrders: OrderFromServer[];
}

export interface OrderFromServer {
    _id: string;
    orderNumber: string;
    userId: { _id: string; username: string; email: string };
    items: { productId: { _id: string; name: string; images: string[] }; quantity: number; price: number; size: string; color: string }[];
    totalPrice: number;
    shipping: number;
    tax: number;
    status: string;
    shippingAddress: { street: string; city: string; zipCode: string; country: string };
    createdAt: string;
}

export interface UserFromServer {
    _id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
    const response = await apiClient.get("/admin/stats");
    return response.data;
};

export const fetchAllOrders = async (params: { page?: number; limit?: number; status?: string }): Promise<PaginatedResponse<OrderFromServer>> => {
    const query: Record<string, string> = {};
    if (params.page) query.page = String(params.page);
    if (params.limit) query.limit = String(params.limit);
    if (params.status) query.status = params.status;

    const response = await apiClient.get("/admin/orders", { params: query });
    return response.data;
};

export const fetchAllUsers = async (params: { page?: number; limit?: number }): Promise<PaginatedResponse<UserFromServer>> => {
    const query: Record<string, string> = {};
    if (params.page) query.page = String(params.page);
    if (params.limit) query.limit = String(params.limit);

    const response = await apiClient.get("/admin/users", { params: query });
    return response.data;
};

export const fetchLowStockProducts = async (threshold?: number): Promise<ProductFromServer[]> => {
    const query: Record<string, string> = {};
    if (threshold) query.threshold = String(threshold);

    const response = await apiClient.get("/admin/low-stock", { params: query });
    return response.data;
};

export const toggleNewArrival = async (productId: string): Promise<ProductFromServer> => {
    const response = await apiClient.put(`/admin/products/${productId}/featured`);
    return response.data;
};

export const fetchAllProducts = async (params: { page?: number; limit?: number; sort?: string }): Promise<PaginatedResponse<ProductFromServer>> => {
    const query: Record<string, string> = {};
    if (params.page) query.page = String(params.page);
    if (params.limit) query.limit = String(params.limit);
    if (params.sort) query.sort = params.sort;

    const response = await apiClient.get("/admin/products", { params: query });
    return response.data;
};

export const createProduct = async (data: Partial<ProductFromServer>): Promise<ProductFromServer> => {
    const response = await apiClient.post("/admin/products", data);
    return response.data;
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<OrderFromServer> => {
    const response = await apiClient.put(`/admin/orders/${orderId}/status`, { status });
    return response.data;
};

export const updateProduct = async (productId: string, updates: Partial<ProductFromServer>): Promise<ProductFromServer> => {
    const response = await apiClient.put(`/admin/products/${productId}`, updates);
    return response.data;
};

export const deleteProduct = async (productId: string): Promise<void> => {
    await apiClient.delete(`/admin/products/${productId}`);
};

export interface MediaImage {
    path: string;
    category: string;
    filename: string;
}

export const fetchMediaLibrary = async (): Promise<MediaImage[]> => {
    const response = await apiClient.get("/admin/media-library");
    return response.data;
};

export const replaceBanner = async (targetPath: string, sourcePath: string): Promise<void> => {
    await apiClient.put("/admin/replace-banner", { targetPath, sourcePath });
};

export const uploadMediaImages = async (files: File[], category: string): Promise<MediaImage[]> => {
    const formData = new FormData();
    for (const file of files) {
        formData.append("images", file);
    }
    formData.append("category", category);

    const response = await apiClient.post("/admin/upload-media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};