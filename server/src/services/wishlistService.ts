import BaseService from "./baseService";
import wishlistModel from "../models/wishlistModel";

class WishlistService extends BaseService {
    constructor() {
        super(wishlistModel);
    }

    async getWishlistByUserId(userId: string) {
        let wishlist = await this.model
            .findOne({ userId })
            .populate("products", "name type price salePrice images category tags");

        if (!wishlist) {
            wishlist = await this.model.create({ userId, products: [] });
        }
        return wishlist;
    }

    async addProductToWishlist(userId: string, productId: string) {
        let wishlist = await this.model.findOne({ userId });
        if (!wishlist) {
            wishlist = await this.model.create({ userId, products: [productId] });
        } else {
            if (!wishlist.products.some((p: any) => p.toString() === productId)) {
                wishlist.products.push(productId);
                await wishlist.save();
            }
        }
        return wishlist.populate("products", "name type price salePrice images category tags");
    }

    async removeProductFromWishlist(userId: string, productId: string) {
        const wishlist = await this.model.findOne({ userId });
        if (!wishlist) {
            throw "Wishlist not found";
        }

        wishlist.products = wishlist.products.filter(
            (p: any) => p.toString() !== productId
        );
        await wishlist.save();

        return wishlist.populate("products", "name type price salePrice images category tags");
    }
}

export default new WishlistService();