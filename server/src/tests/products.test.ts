import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import productsModel from "../models/productsModel";
import userModel from "../models/userModel";
import { initTestApp, createTestUser, registerTestUser, makeAdmin, closeTestDB } from "./testUtils";

let app: Express;

const testUser = createTestUser("producttestuser", "producttestuser@example.com");

let productId: string;

beforeAll(async () => {
    app = await initTestApp();
    await productsModel.deleteMany();
    await userModel.deleteMany();

    await registerTestUser(testUser);
    await makeAdmin(testUser._id);
});

afterAll(async () => {
    await closeTestDB();
});

describe("Products API Tests", () => {
    describe("POST /products", () => {
        test("should create a new product (admin)", async () => {
            const res = await request(app)
                .post("/products")
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({
                    name: "Classic T-Shirt",
                    type: "T-Shirt",
                    description: "A comfortable classic cotton t-shirt",
                    price: 89.90,
                    salePrice: 69.90,
                    category: "men",
                    sizes: ["S", "M", "L", "XL"],
                    colors: ["black", "white", "navy"],
                    images: ["tshirt1.jpg", "tshirt2.jpg"],
                    stock: 50,
                    tags: ["cotton", "casual", "summer"]
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("_id");
            expect(res.body.name).toBe("Classic T-Shirt");
            expect(res.body.type).toBe("T-Shirt");
            expect(res.body.price).toBe(89.90);
            expect(res.body.salePrice).toBe(69.90);
            expect(res.body.category).toBe("men");
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
                    type: "Shirt",
                    description: "Test description",
                    price: 100,
                    category: "men",
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
                    type: "Shirt",
                    description: "Test description",
                    price: 100,
                    category: "men",
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

        test("should filter products by category", async () => {
            const res = await request(app).get("/products?category=men");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0].category).toBe("men");
        });

        test("should return empty array for non-matching category", async () => {
            const res = await request(app).get("/products?category=women");

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

    describe("GET /products/type/:type", () => {
        test("should get products by type", async () => {
            const res = await request(app).get("/products/type/T-Shirt");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0].type).toBe("T-Shirt");
        });

        test("should return empty array for non-existent type", async () => {
            const res = await request(app).get("/products/type/nonexistent");

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
