import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    brand: string;
    description: string;
    price: number;
    salePrice?: number;
    category: string;
    sizes: string[];
    colors: string[];
    images: string[];
    stock: number;
    tags: string[];
    gender: "men" | "women" | "unisex";
}

const productSchema = new Schema<IProduct>(
    {
        name: { 
            type: String, 
            required: true 
        },

        brand: { 
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

        tags: [{ type: String }],

        gender: {
            type: String,
            enum: ["men", "women", "unisex"],
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model<IProduct>("products", productSchema);
