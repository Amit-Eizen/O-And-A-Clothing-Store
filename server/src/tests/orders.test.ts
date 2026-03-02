import request from "supertest";
import initApp from "../app";
import { Express } from "express";
import mongoose from "mongoose";
import ordersModel from "../models/ordersModel";
import cartModel from "../models/cartModel";
import userModel from "../models/userModel";
import productsModel from "../models/productsModel";

let app: Express;

const testUser = {
    username: "ordertestuser",
    email: "ordertestuser@example.com",
    password: "testpassword123",
    token: "",
    _id: ""
};

let productId: string;
let orderId: string;

const shippingAddress = {
    street: "123 Main St",
    city: "Tel Aviv",
    zipCode: "6100000",
    country: "Israel"
};

beforeAll(async () => {
    app = await initApp();
    await ordersModel.deleteMany();
    await cartModel.deleteMany();
    await userModel.deleteMany();
    await productsModel.deleteMany();

    // Register test user
    const res = await request(app)
        .post("/register")
        .send({
            username: testUser.username,
            email: testUser.email,
            password: testUser.password
        });

    testUser.token = res.body.token;
    const payload = JSON.parse(Buffer.from(testUser.token.split(".")[1], "base64").toString());
    testUser._id = payload._id;

    // Set as admin for product creation
    await userModel.findByIdAndUpdate(testUser._id, { role: "admin" });

    // Create a product
    const productRes = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${testUser.token}`)
        .send({
            name: "Order Test Shirt",
            brand: "O&A",
            description: "A shirt for order tests",
            price: 100,
            category: "shirts",
            gender: "men",
            sizes: ["M"],
            colors: ["black"],
            images: ["shirt.jpg"],
            stock: 10,
            tags: ["test"]
        });

    productId = productRes.body._id;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Orders API Tests", () => {
    describe("POST /orders", () => {
        test("should fail to create order with empty cart", async () => {
            const res = await request(app)
                .post("/orders")
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({
                    shipping: 30,
                    shippingAddress
                });

            expect(res.status).toBe(400);
        });

        test("should create order from cart", async () => {
            // Add item to cart first
            await request(app)
                .post("/cart/items")
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({
                    productId,
                    quantity: 2,
                    size: "M",
                    color: "black",
                    price: 100
                });

            const res = await request(app)
                .post("/orders")
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({
                    shipping: 30,
                    shippingAddress
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("orderNumber");
            expect(res.body.items.length).toBe(1);
            expect(res.body.totalPrice).toBe(230); // (100 * 2) + 30 shipping
            expect(res.body.shipping).toBe(30);
            expect(res.body.status).toBe("pending");
            expect(res.body.shippingAddress.city).toBe("Tel Aviv");
            orderId = res.body._id;
        });

        test("should clear cart after order creation", async () => {
            const res = await request(app)
                .get("/cart")
                .set("Authorization", `Bearer ${testUser.token}`);

            expect(res.status).toBe(200);
            expect(res.body.items).toEqual([]);
        });

        test("should fail without authentication", async () => {
            const res = await request(app)
                .post("/orders")
                .send({
                    shipping: 30,
                    shippingAddress
                });

            expect(res.status).toBe(401);
        });
    });

    describe("GET /orders", () => {
        test("should get user's orders", async () => {
            const res = await request(app)
                .get("/orders")
                .set("Authorization", `Bearer ${testUser.token}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0].orderNumber).toBeDefined();
        });

        test("should fail without authentication", async () => {
            const res = await request(app).get("/orders");

            expect(res.status).toBe(401);
        });
    });

    describe("GET /orders/:id", () => {
        test("should get order by ID", async () => {
            const res = await request(app)
                .get(`/orders/${orderId}`)
                .set("Authorization", `Bearer ${testUser.token}`);

            expect(res.status).toBe(200);
            expect(res.body._id).toBe(orderId);
            expect(res.body.orderNumber).toBeDefined();
        });

        test("should return 404 for non-existent order", async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const res = await request(app)
                .get(`/orders/${fakeId}`)
                .set("Authorization", `Bearer ${testUser.token}`);

            expect(res.status).toBe(404);
        });
    });

    describe("PUT /orders/:id/status", () => {
        test("should update order status (admin)", async () => {
            const res = await request(app)
                .put(`/orders/${orderId}/status`)
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({ status: "processing" });

            expect(res.status).toBe(200);
            expect(res.body.status).toBe("processing");
        });

        test("should fail without admin access", async () => {
            const regularRes = await request(app)
                .post("/register")
                .send({
                    username: "orderregular",
                    email: "orderregular@example.com",
                    password: "regularpass123"
                });

            const res = await request(app)
                .put(`/orders/${orderId}/status`)
                .set("Authorization", `Bearer ${regularRes.body.token}`)
                .send({ status: "shipped" });

            expect(res.status).toBe(403);
        });

        test("should return 404 for non-existent order", async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const res = await request(app)
                .put(`/orders/${fakeId}/status`)
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({ status: "shipped" });

            expect(res.status).toBe(404);
        });
    });
});
