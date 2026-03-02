import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    size: string;
    color: string;
    price: number;
}

export interface ICart extends Document {
    userId: mongoose.Types.ObjectId;
    items: mongoose.Types.DocumentArray<ICartItem>;
}

const cartSchema = new Schema<ICart>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
            unique: true,
        },

        items: [{
            productId: { 
                type: Schema.Types.ObjectId, 
                ref: "products", 
                required: true 
            },
            quantity: { 
                type: Number, 
                required: true, 
                min: 1 
            },
            size: { 
                type: String, 
                required: true 
            },
            color: { 
                type: String, 
                required: true 
            },
            price: { 
                type: Number, 
                required: true 
            }
        }]
    },
    { timestamps: true }
);

export default mongoose.model<ICart>("cart", cartSchema);
