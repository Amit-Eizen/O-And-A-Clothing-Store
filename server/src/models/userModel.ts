import mongoose from "mongoose";

export interface IUser {
    username: string;
    email: string;
    password: string;
    refreshToken?: string[];
    address?: {
        street?: string;
        city?: string;
        zipCode?: string;
        country: string;
    };
    phoneNumber?: string;
    profileImage?: string;
    role: "user" | "admin";
} 

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },

    email: { 
        type: String, 
        required: true, 
        unique: true 
    },

    password: { 
        type: String, 
        required: true 
    },

    refreshToken: {
        type: [String],
        default: []
    },

    address: {
        street: { type: String },
        city: { type: String },
        zipCode: { type: String },
        country: { type: String }
    },

    phoneNumber: { 
        type: String 
    },

    profileImage: { 
        type: String 
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }

});

export default mongoose.model("user", userSchema);