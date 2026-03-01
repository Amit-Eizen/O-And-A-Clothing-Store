import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    content: string;
    rating: number;
    images: string[];
    likes: mongoose.Types.ObjectId[];
}

const reviewSchema = new Schema<IReview>(
    {
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: "user", 
            required: true 
        },

        title: { 
            type: String, 
            required: true 
        },

        content: { 
            type: String, 
            required: true 
        },

        rating: { 
            type: Number, 
            required: true, 
            min: 1, max: 5 
        },
        
        images: [{ type: String }],
        likes: [{ type: Schema.Types.ObjectId, ref: "user" }],
    },
    { timestamps: true }
);

export default mongoose.model<IReview>("reviews", reviewSchema);
