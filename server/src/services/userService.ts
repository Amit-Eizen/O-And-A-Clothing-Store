import BaseService from "./baseService";
import userModel from "../models/userModel";

class UserService extends BaseService {
    constructor() {
        super(userModel);
    }

    async getProfile(userId: string) {
        const user = await this.model
            .findById(userId)
            .select("-password -refreshToken");
        return user;
    }

    async getProfileNameAndImage(userId: string) {
        const user = await this.model
            .findById(userId)
            .select("username profileImage");
        return user;
    }

    async updateProfile(userId: string, updateData: {
        username?: string;
        profileImage?: string;
        email?: string;
        phoneNumber?: string;
        address?: {
            street?: string;
            city?: string;
            zipCode?: string;
            country?: string;
        };
    }) {
        const allowedUpdates: any = {};
        if (updateData.username !== undefined) allowedUpdates.username = updateData.username;
        if (updateData.profileImage !== undefined) allowedUpdates.profileImage = updateData.profileImage;
        if (updateData.email !== undefined) allowedUpdates.email = updateData.email;
        if (updateData.phoneNumber !== undefined) allowedUpdates.phoneNumber = updateData.phoneNumber;
        if (updateData.address !== undefined) allowedUpdates.address = updateData.address;

        const user = await this.model
            .findByIdAndUpdate(userId, allowedUpdates, { new: true })
            .select("-password -refreshToken");
        return user;
    } 
}

export default new UserService();
