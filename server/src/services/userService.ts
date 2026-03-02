import BaseService from "./baseService";
import userModel from "../models/userModel";

class UserService extends BaseService {
    constructor() {
        super(userModel);
    }

    async getProfile(userId: string) {
        return this.model
            .findById(userId)
            .select("-password -refreshToken");
    }

    async getProfileNameAndImage(userId: string) {
        return this.model
            .findById(userId)
            .select("username profileImage");
    }

    async updateProfile(userId: string, updateData: { username?: string; profileImage?: string }) {
        const allowedUpdates: any = {};
        if (updateData.username !== undefined) allowedUpdates.username = updateData.username;
        if (updateData.profileImage !== undefined) allowedUpdates.profileImage = updateData.profileImage;

        return this.model
            .findByIdAndUpdate(userId, allowedUpdates, { new: true })
            .select("-password -refreshToken");
    }
}

export default new UserService();
