import request from "supertest";
import { Express } from "express";
import wishlistModel from "../models/wishlistModel";
import userModel from "../models/userModel";
import productsModel from "../models/productsModel";
import { initTestApp, createTestUser, registerTestUser, makeAdmin, closeTestDB } from "./testUtils";

let app: Express;

const testUser = createTestUser("wishlisttestuser", "wishlisttestuser@example.com");

let productId1: string;
let productId2: string;

beforeAll(async () => {
    app = await initTestApp();
    await wishlistModel.deleteMany();
    await userModel.deleteMany();
    await productsModel.deleteMany();

    await registerTestUser(testUser);
    await makeAdmin(testUser._id);

    const productRes1 = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${testUser.token}`)
        .send({
            name: "Wishlist Shirt",
            type: "Shirt",
            description: "A test shirt",
            price: 120,
            salePrice: 99.90,
            category: "men",
            sizes: ["S", "M", "L"],
            colors: ["black"],
            images: ["shirt1.jpg"],
            stock: 15,
            tags: ["cotton"]
        });

    productId1 = productRes1.body._id;

    const productRes2 = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${testUser.token}`)
        .send({
            name: "Wishlist Pants",
            type: "Pants",
            description: "Test pants",
            price: 89.90,
            category: "women",
            sizes: ["M", "L"],
            colors: ["blue"],
            images: ["pants1.jpg"],
            stock: 10,
            tags: ["denim"]
        });

    productId2 = productRes2.body._id;
});

afterAll(async () => {
    await closeTestDB();
});

describe("Wishlist API Tests", () => {
    describe("GET /wishlist", () => {
        test("should return empty wishlist for new user", async () => {
            const res = await request(app)
                .get("/wishlist")
                .set("Authorization", `Bearer ${testUser.token}`);

            expect(res.status).toBe(200);
            expect(res.body.products).toEqual([]);
        });

        test("should fail without authentication", async () => {
            const res = await request(app).get("/wishlist");

            expect(res.status).toBe(401);
        });
    });

    describe("POST /wishlist", () => {
        test("should add product to wishlist", async () => {
            const res = await request(app)
                .post("/wishlist")
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({ productId: productId1 });

            expect(res.status).toBe(200);
            expect(res.body.products.length).toBe(1);
        });

        test("should add second product to wishlist", async () => {
            const res = await request(app)
                .post("/wishlist")
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({ productId: productId2 });

            expect(res.status).toBe(200);
            expect(res.body.products.length).toBe(2);
        });

        test("should not duplicate product in wishlist", async () => {
            const res = await request(app)
                .post("/wishlist")
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({ productId: productId1 });

            expect(res.status).toBe(200);
            expect(res.body.products.length).toBe(2);
        });

        test("should fail without authentication", async () => {
            const res = await request(app)
                .post("/wishlist")
                .send({ productId: productId1 });

            expect(res.status).toBe(401);
        });
    });

    describe("GET /wishlist (with products)", () => {
        test("should return wishlist with populated products", async () => {
            const res = await request(app)
                .get("/wishlist")
                .set("Authorization", `Bearer ${testUser.token}`);

            expect(res.status).toBe(200);
            expect(res.body.products.length).toBe(2);
            expect(res.body.products[0].name).toBeDefined();
            expect(res.body.products[0].price).toBeDefined();
            expect(res.body.products[0].images).toBeDefined();
        });
    });

    describe("DELETE /wishlist/:productId", () => {
        test("should remove product from wishlist", async () => {
            const res = await request(app)
                .delete(`/wishlist/${productId1}`)
                .set("Authorization", `Bearer ${testUser.token}`);

            expect(res.status).toBe(200);
            expect(res.body.products.length).toBe(1);
        });

        test("should remove last product from wishlist", async () => {
            const res = await request(app)
                .delete(`/wishlist/${productId2}`)
                .set("Authorization", `Bearer ${testUser.token}`);

            expect(res.status).toBe(200);
            expect(res.body.products).toEqual([]);
        });

        test("should fail without authentication", async () => {
            const res = await request(app)
                .delete(`/wishlist/${productId1}`);

            expect(res.status).toBe(401);
        });
    });
});
