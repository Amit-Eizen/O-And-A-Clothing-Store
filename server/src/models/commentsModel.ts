import mongoose, {Schema, Document} from "mongoose";

export interface IComment extends Document {
    userId: mongoose.Types.ObjectId;
    reviewId: mongoose.Types.ObjectId;
    content: string;
}

const commentSchema = new Schema<IComment>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
        reviewId: { type: Schema.Types.ObjectId, ref: "reviews", required: true },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IComment>("comments", commentSchema);
