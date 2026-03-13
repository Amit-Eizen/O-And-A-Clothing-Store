import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
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
}

const productSchema = new Schema<IProduct>(
    {
        name: { 
            type: String, 
            required: true 
        },

        type: { 
            type: String, 
            required: true 
        },

        description: { 
            type: String, 
            required: true 
        },

        price: { 
            type: Number, 
            required: true 
        },

        salePrice: { 
            type: Number 
        },

        category: { 
            type: String, 
            enum: ["men", "women", "accessories"],
            required: true 
        },

        sizes: [{ type: String }],
        colors: [{ type: String }],
        images: [{ type: String }],
        
        stock: {
            type: Number,
            required: true,
            default: 0
        },

        soldCount: {
            type: Number,
            default: 0
        },

        tags: [{ type: String }],
        features: [{ type: String }],
    },
    { timestamps: true }
);

export default mongoose.model<IProduct>("products", productSchema);
