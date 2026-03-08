import mongoose, { Schema, Document } from "mongoose";

export interface IWishlist extends Document {
    userId: mongoose.Types.ObjectId;
    products: mongoose.Types.ObjectId[];
}

const wishlistSchema = new Schema<IWishlist>(
    {
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: "user", 
            required: true, 
            unique: true
        },

        products: [{
            type: Schema.Types.ObjectId,
            ref: "products",
        }],
    },
    { timestamps: true }
);

export default mongoose.model<IWishlist>("wishlist", wishlistSchema);