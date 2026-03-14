import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    size: string;
    color: string;
    price: number;
}

export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    orderNumber: string;
    items: IOrderItem[];
    totalPrice: number;
    shipping: number;
    tax: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    shippingAddress: {
        street: string;
        city: string;
        zipCode: string;
        country: string;
    };
}

const orderSchema = new Schema<IOrder>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },

        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "products",
                    required: true,
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
        }],

        totalPrice: { 
            type: Number, 
            required: true 
        },

        shipping: { 
            type: Number, 
            default: 0 
        },

        tax: {
            type: Number,
            default: 0
        },

        status: { 
            type: String, 
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"], 
            default: "pending" 
        },

        shippingAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, required: true }
        },
    },
    { timestamps: true }
);

export default mongoose.model<IOrder>("orders", orderSchema);