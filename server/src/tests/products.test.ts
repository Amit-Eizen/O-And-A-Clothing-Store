import request from "supertest";
import initApp from "../app";
import e, { Express } from "express";
import mongoose from "mongoose";
import productsModel from "../models/productsModel";
import userModel from "../models/userModel";

let app: Express;

const testUser = {
    username: "producttestuser",
    email: "producttestuser@example.com",
    password: "testpassword123",
    token: "",
    refreshToken: "",
    _id: ""
};

let productId: string;

beforeAll(async () => {
    app = await initApp();
    await productsModel.deleteMany();
    await userModel.deleteMany();

    //Register a test user to get a token for authenticated routes
    const res = await request(app)
        .post("/register")
        .send({
            "username": testUser.username,
            "email": testUser.email,
            "password": testUser.password
        });

    testUser.token = res.body.token;
    testUser.refreshToken = res.body.refreshToken;

    //Decode token to get user ID
    const payload = JSON.parse(Buffer.from(testUser.token.split(".")[1], "base64").toString());
    testUser._id = payload._id;

    // Set user as admin
    await userModel.findByIdAndUpdate(testUser._id, { role: "admin" });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Products API Tests", () => {
    describe("POST /products", () => {
        test("should create a new product (admin)", async () => {
            const res = await request(app)
                .post("/products")
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({
                    name: "Classic T-Shirt",
                    brand: "O&A",
                    description: "A comfortable classic cotton t-shirt",
                    price: 89.90,
                    salePrice: 69.90,
                    category: "shirts",
                    gender: "men",
                    sizes: ["S", "M", "L", "XL"],
                    colors: ["black", "white", "navy"],
                    images: ["tshirt1.jpg", "tshirt2.jpg"],
                    stock: 50,
                    tags: ["cotton", "casual", "summer"]
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("_id");
            expect(res.body.name).toBe("Classic T-Shirt");
            expect(res.body.brand).toBe("O&A");
            expect(res.body.price).toBe(89.90);
            expect(res.body.salePrice).toBe(69.90);
            expect(res.body.category).toBe("shirts");
            expect(res.body.gender).toBe("men");
            expect(res.body.sizes).toEqual(["S", "M", "L", "XL"]);
            expect(res.body.colors).toEqual(["black", "white", "navy"]);
            expect(res.body.stock).toBe(50);
            productId = res.body._id;
        });

        test("should fail to create product without authentication", async () => {
            const res = await request(app)
                .post("/products")
                .send({
                    name: "Test Product",
                    brand: "Test",
                    description: "Test description",
                    price: 100,
                    category: "shirts",
                    gender: "men",
                    stock: 10
                });

            expect(res.status).toBe(401);
        });

        test("should fail to create product without admin access", async () => {
            const regularUserRes = await request(app)
                .post("/register")
                .send({
                    username: "regularuser",
                    email: "regularuser@example.com",
                    password: "regularpassword123"
                });

            const regularUserToken = regularUserRes.body.token;

            const res = await request(app)
                .post("/products")
                .set("Authorization", `Bearer ${regularUserToken}`)
                .send({
                    name: "Test Product",
                    brand: "Test",
                    description: "Test description",
                    price: 100,
                    category: "shirts",
                    gender: "men",
                    stock: 10
                });

            expect(res.status).toBe(403);
        });
    });

    describe("GET /products", () => {
        test("should retrieve all products", async () => {
            const res = await request(app).get("/products");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });

        test("should filter products by gender", async () => {
            const res = await request(app).get("/products?gender=men");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0].gender).toBe("men");
        });

        test("should return empty array for non-matching gender", async () => {
            const res = await request(app).get("/products?gender=women");

            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });
    });

    describe("GET /products/:id", () => {
        test("should get a product by ID", async () => {
            const res = await request(app).get(`/products/${productId}`);

            expect(res.status).toBe(200);
            expect(res.body._id).toBe(productId);
            expect(res.body.name).toBe("Classic T-Shirt");
        });
        
        test("should return 404 for non-existent product", async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const res = await request(app).get(`/products/${fakeId}`);

            expect(res.status).toBe(404);
        });
    });

    describe("GET /products/category/:category", () => {
        test("should get products by category", async () => {
            const res = await request(app).get("/products/category/shirts");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0].category).toBe("shirts");
        });

        test("should return empty array for non-existent category", async () => {
            const res = await request(app).get("/products/category/nonexistent");

            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });
    });

    describe("GET /products/search", () => {
        test("should search products by name", async () => {
            const res = await request(app).get("/products/search?q=Classic");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });

        test("should search products by brand", async () => {
            const res = await request(app).get("/products/search?q=O%26A");

            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        test("should return 400 when search query is empty", async () => {
            const res = await request(app).get("/products/search?q=");

            expect(res.status).toBe(400);
        });

        test("should return empty array for no matching results", async () => {
            const res = await request(app).get("/products/search?q=xyznonexistent");

            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });
    });

    describe("PUT /products/:id", () => {
        test("should update a product (admin)", async () => {
            const res = await request(app)
                .put(`/products/${productId}`)
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({
                    price: 79.90,
                    stock: 30
                });

            expect(res.status).toBe(200);
            expect(res.body.price).toBe(79.90);
            expect(res.body.stock).toBe(30);
            expect(res.body.name).toBe("Classic T-Shirt");
        });
    });

    describe("DELETE /products/:id", () => {
        test("should delete a product (admin)", async () => {
            const res = await request(app)
                .delete(`/products/${productId}`)
                .set("Authorization", `Bearer ${testUser.token}`);

            expect(res.status).toBe(200);
        });

        test("should return 404 for already deleted product", async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const res = await request(app)
                .delete(`/products/${fakeId}`)
                .set("Authorization", `Bearer ${testUser.token}`);

            expect(res.status).toBe(404);
        });
    });
});