import request from "supertest";
import initApp from "../app";
import { Express } from "express";
import mongoose from "mongoose";
import userModel from "../models/userModel";
import productsModel from "../models/productsModel";

let app: Express;

export const getApp = () => app;

export const initTestApp = async () => {
    app = await initApp();
    return app;
};

export const closeTestDB = async () => {
    await mongoose.connection.close();
};

export interface TestUser {
    username: string;
    email: string;
    password: string;
    token: string;
    refreshToken: string;
    _id: string;
}

export const createTestUser = (
    username: string,
    email: string,
    password: string = "testpassword123"
): TestUser => ({
    username,
    email,
    password,
    token: "",
    refreshToken: "",
    _id: ""
});

export const registerTestUser = async (testUser: TestUser) => {
    const response = await request(app)
        .post("/register")
        .send({
            username: testUser.username,
            email: testUser.email,
            password: testUser.password
        });

    testUser.token = response.body.token;
    testUser.refreshToken = response.body.refreshToken;

    const payload = JSON.parse(
        Buffer.from(testUser.token.split(".")[1], "base64").toString()
    );
    testUser._id = payload._id;

    return testUser;
};

export const makeAdmin = async (userId: string) => {
    await userModel.findByIdAndUpdate(userId, { role: "admin" });
};

export const createTestProduct = async (overrides?: Partial<{
    name: string;
    brand: string;
    description: string;
    price: number;
    category: string;
    gender: string;
    sizes: string[];
    colors: string[];
    images: string[];
    stock: number;
    tags: string[];
}>) => {
    const product = await productsModel.create({
        name: "Test Product",
        brand: "O&A",
        description: "A test product",
        price: 99.9,
        category: "shirts",
        gender: "men",
        sizes: ["M"],
        colors: ["black"],
        images: ["test.jpg"],
        stock: 10,
        tags: ["test"],
        ...overrides
    });
    return product;
};