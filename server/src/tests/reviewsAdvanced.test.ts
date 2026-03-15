import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import reviewsModel from "../models/reviewsModel";
import commentsModel from "../models/commentsModel";
import userModel from "../models/userModel";
import productsModel from "../models/productsModel";
import ordersModel from "../models/ordersModel";
import { initTestApp, createTestUser, registerTestUser, closeTestDB } from "./testUtils";

let app: Express;

const owner = createTestUser("reviewowner", "reviewowner@example.com");
const otherUser = createTestUser("otheruser", "otheruser@example.com");

let productId: string;
let reviewId: string;

beforeAll(async () => {
    app = await initTestApp();
    await reviewsModel.deleteMany();
    await commentsModel.deleteMany();
    await userModel.deleteMany();
    await productsModel.deleteMany();
    await ordersModel.deleteMany();

    await registerTestUser(owner);
    await registerTestUser(otherUser);

    // Create product directly in DB (no admin needed)
    const product = await productsModel.create({
        name: "Test Sneakers",
        type: "Shoes",
        description: "Test sneakers",
        price: 120,
        category: "men",
        sizes: ["42"],
        colors: ["white"],
        images: ["shoes1.jpg"],
        stock: 10,
        tags: ["sport"]
    });
    productId = product._id.toString();

    // Create order for owner (so hasPurchased passes)
    await ordersModel.create({
        userId: owner._id,
        orderNumber: "ORD-2026-ADV1",
        items: [{
            productId: product._id,
            quantity: 1,
            size: "42",
            color: "white",
            price: 120
        }],
        totalPrice: 120,
        status: "processing",
        shippingAddress: {
            street: "1 Test St",
            city: "Tel Aviv",
            zipCode: "12345",
            country: "Israel"
        }
    });
});

afterAll(async () => {
    await closeTestDB();
});

describe("Reviews Advanced Tests", () => {
    describe("POST /reviews — hasPurchased check", () => {
        test("should reject review if user has not purchased the product", async () => {
            const res = await request(app)
                .post("/reviews")
                .set("Authorization", `Bearer ${otherUser.token}`)
                .send({
                    productId,
                    title: "Nice!",
                    content: "Great product",
                    rating: 5,
                    images: []
                });

            expect(res.status).toBe(403);
            expect(res.body.message).toContain("purchased");
        });

        test("should allow review if user has purchased the product", async () => {
            const res = await request(app)
                .post("/reviews")
                .set("Authorization", `Bearer ${owner.token}`)
                .send({
                    productId,
                    title: "Great Sneakers",
                    content: "Very comfortable",
                    rating: 5,
                    images: []
                });

            expect(res.status).toBe(201);
            expect(res.body.title).toBe("Great Sneakers");
            reviewId = res.body._id;
        });

        test("should reject duplicate review on same product", async () => {
            const res = await request(app)
                .post("/reviews")
                .set("Authorization", `Bearer ${owner.token}`)
                .send({
                    productId,
                    title: "Another Review",
                    content: "Trying again",
                    rating: 4,
                    images: []
                });

            expect(res.status).toBe(409);
            expect(res.body.message).toContain("already reviewed");
        });
    });

    describe("PUT /reviews/:id — ownership check", () => {
        test("should allow owner to update their review", async () => {
            const res = await request(app)
                .put(`/reviews/${reviewId}`)
                .set("Authorization", `Bearer ${owner.token}`)
                .send({ title: "Updated Title" });

            expect(res.status).toBe(200);
            expect(res.body.title).toBe("Updated Title");
        });

        test("should reject update from non-owner", async () => {
            const res = await request(app)
                .put(`/reviews/${reviewId}`)
                .set("Authorization", `Bearer ${otherUser.token}`)
                .send({ title: "Hacked Title" });

            expect(res.status).toBe(403);
            expect(res.body.message).toContain("Unauthorized");
        });
    });

    describe("DELETE /reviews/:id — ownership + cascade", () => {
        test("should reject delete from non-owner", async () => {
            const res = await request(app)
                .delete(`/reviews/${reviewId}`)
                .set("Authorization", `Bearer ${otherUser.token}`);

            expect(res.status).toBe(403);
        });

        test("should cascade delete comments when review is deleted", async () => {
            // Add comments to the review
            await request(app)
                .post("/comments")
                .set("Authorization", `Bearer ${owner.token}`)
                .send({ reviewId, content: "Comment 1" });

            await request(app)
                .post("/comments")
                .set("Authorization", `Bearer ${otherUser.token}`)
                .send({ reviewId, content: "Comment 2" });

            // Verify comments exist
            const commentsBefore = await commentsModel.countDocuments({ reviewId });
            expect(commentsBefore).toBe(2);

            // Delete review
            const res = await request(app)
                .delete(`/reviews/${reviewId}`)
                .set("Authorization", `Bearer ${owner.token}`);

            expect(res.status).toBe(200);

            // Verify comments were cascade deleted
            const commentsAfter = await commentsModel.countDocuments({ reviewId });
            expect(commentsAfter).toBe(0);
        });
    });

    describe("GET /reviews/product/:productId", () => {
        beforeAll(async () => {
            // Previous review was deleted in cascade test — create new ones
            // Create order for otherUser too
            await ordersModel.create({
                userId: otherUser._id,
                orderNumber: "ORD-2026-ADV2",
                items: [{
                    productId,
                    quantity: 1,
                    size: "42",
                    color: "white",
                    price: 120
                }],
                totalPrice: 120,
                status: "delivered",
                shippingAddress: {
                    street: "2 Test St",
                    city: "Haifa",
                    zipCode: "54321",
                    country: "Israel"
                }
            });

            await request(app)
                .post("/reviews")
                .set("Authorization", `Bearer ${owner.token}`)
                .send({ productId, title: "Review A", content: "Good", rating: 5, images: [] });

            await request(app)
                .post("/reviews")
                .set("Authorization", `Bearer ${otherUser.token}`)
                .send({ productId, title: "Review B", content: "OK", rating: 3, images: [] });
        });

        test("should return reviews with stats for a product", async () => {
            const res = await request(app).get(`/reviews/product/${productId}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("reviews");
            expect(res.body).toHaveProperty("total");
            expect(res.body).toHaveProperty("averageRating");
            expect(res.body).toHaveProperty("reviewBreakdown");
            expect(res.body.total).toBe(2);
            expect(res.body.averageRating).toBe(4);
        });

        test("should return reviewBreakdown with star percentages", async () => {
            const res = await request(app).get(`/reviews/product/${productId}`);

            expect(res.body.reviewBreakdown.length).toBe(5);
            const star5 = res.body.reviewBreakdown.find((b: any) => b.stars === 5);
            const star3 = res.body.reviewBreakdown.find((b: any) => b.stars === 3);
            expect(star5.percentage).toBe(50);
            expect(star3.percentage).toBe(50);
        });

        test("should populate userId with username", async () => {
            const res = await request(app).get(`/reviews/product/${productId}`);

            expect(res.body.reviews[0].userId).toHaveProperty("username");
        });

        test("should return empty stats for product with no reviews", async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const res = await request(app).get(`/reviews/product/${fakeId}`);

            expect(res.status).toBe(200);
            expect(res.body.total).toBe(0);
            expect(res.body.averageRating).toBe(0);
            expect(res.body.reviews).toEqual([]);
        });

        test("should support sorting", async () => {
            const res = await request(app).get(`/reviews/product/${productId}?sort=highest`);

            expect(res.status).toBe(200);
            expect(res.body.reviews[0].rating).toBeGreaterThanOrEqual(res.body.reviews[1].rating);
        });

        test("should support pagination", async () => {
            const res = await request(app).get(`/reviews/product/${productId}?page=1&limit=1`);

            expect(res.status).toBe(200);
            expect(res.body.reviews.length).toBe(1);
            expect(res.body.total).toBe(2);
        });
    });
});
