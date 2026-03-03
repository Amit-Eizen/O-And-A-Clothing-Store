import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import cartModel from "../models/cartModel";
import userModel from "../models/userModel";
import productsModel from "../models/productsModel";
import { initTestApp, createTestUser, registerTestUser, makeAdmin, closeTestDB } from "./testUtils";

let app: Express;

const testUser = createTestUser("carttestuser", "carttestuser@example.com");

let productId: string;
let itemId: string;

beforeAll(async () => {
    app = await initTestApp();
    await cartModel.deleteMany();
    await userModel.deleteMany();
    await productsModel.deleteMany();

    await registerTestUser(testUser);
    await makeAdmin(testUser._id);

    const productRes = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${testUser.token}`)
        .send({
            name: "Test Shirt",
            brand: "O&A",
            description: "A test shirt",
            price: 99.90,
            salePrice: 79.90,
            category: "shirts",
            gender: "men",
            sizes: ["S", "M", "L"],
            colors: ["black", "white"],
            images: ["shirt1.jpg"],
            stock: 20,
            tags: ["cotton"]
        });

    productId = productRes.body._id;
});

afterAll(async () => {
    await closeTestDB();
});

describe("Cart API Tests", () => {
    describe("GET /cart", () => {
        test("should return empty cart for new user", async () => {
            const res = await request(app)
                .get("/cart")
                .set("Authorization", `Bearer ${testUser.token}`);

            expect(res.status).toBe(200);
            expect(res.body.items).toEqual([]);
        });

        test("should fail without authentication", async () => {
            const res = await request(app).get("/cart");

            expect(res.status).toBe(401);
        });
    });

    describe("POST /cart/items", () => {
        test("should add item to cart", async () => {
            const res = await request(app)
                .post("/cart/items")
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({
                    productId,
                    quantity: 2,
                    size: "M",
                    color: "black",
                    price: 79.90
                });

            expect(res.status).toBe(200);
            expect(res.body.items.length).toBe(1);
            expect(res.body.items[0].productId).toBe(productId);
            expect(res.body.items[0].quantity).toBe(2);
            expect(res.body.items[0].size).toBe("M");
            expect(res.body.items[0].color).toBe("black");
            itemId = res.body.items[0]._id;
        });

        test("should increase quantity for same product+size+color", async () => {
            const res = await request(app)
                .post("/cart/items")
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({
                    productId,
                    quantity: 1,
                    size: "M",
                    color: "black",
                    price: 79.90
                });

            expect(res.status).toBe(200);
            expect(res.body.items.length).toBe(1);
            expect(res.body.items[0].quantity).toBe(3);
        });

        test("should add as new item for different size", async () => {
            const res = await request(app)
                .post("/cart/items")
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({
                    productId,
                    quantity: 1,
                    size: "L",
                    color: "black",
                    price: 79.90
                });

            expect(res.status).toBe(200);
            expect(res.body.items.length).toBe(2);
        });

        test("should fail without authentication", async () => {
            const res = await request(app)
                .post("/cart/items")
                .send({
                    productId,
                    quantity: 1,
                    size: "M",
                    color: "black",
                    price: 79.90
                });

            expect(res.status).toBe(401);
        });
    });

    describe("PUT /cart/items/:itemId", () => {
        test("should update item quantity", async () => {
            const res = await request(app)
                .put(`/cart/items/${itemId}`)
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({ quantity: 5 });

            expect(res.status).toBe(200);
            const updatedItem = res.body.items.find((i: any) => i._id === itemId);
            expect(updatedItem.quantity).toBe(5);
        });

        test("should return 404 for non-existent item", async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const res = await request(app)
                .put(`/cart/items/${fakeId}`)
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({ quantity: 1 });

            expect(res.status).toBe(404);
        });
    });

    describe("DELETE /cart/items/:itemId", () => {
        test("should remove item from cart", async () => {
            const res = await request(app)
                .delete(`/cart/items/${itemId}`)
                .set("Authorization", `Bearer ${testUser.token}`);

            expect(res.status).toBe(200);
            expect(res.body.items.length).toBe(1);
        });
    });

    describe("DELETE /cart", () => {
        test("should clear entire cart", async () => {
            const res = await request(app)
                .delete("/cart")
                .set("Authorization", `Bearer ${testUser.token}`);

            expect(res.status).toBe(200);
            expect(res.body.items).toEqual([]);
        });
    });
});
