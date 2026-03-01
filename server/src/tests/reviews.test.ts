import request from "supertest";
import initApp from "../app";
import { Express } from "express";
import mongoose from "mongoose";
import reviewsModel from "../models/reviewsModel";
import userModel from "../models/userModel";

let app: Express;

const testUser = {
    username: "reviewtestuser",
    email: "reviewtestuser@example.com",
    password: "testpassword123",
    token: "",
    refreshToken: "",
    _id: ""
};

let reviewId: string;

beforeAll(async () => {
    app = await initApp();
    await userModel.deleteMany();
    await reviewsModel.deleteMany();

    //Register a user to get a token for authenticated routes
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
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Reviews API Tests", () => {
    describe("POST /reviews", () => {
        test("should create a new review", async () => {
            const res = await request(app)
                .post("/reviews")
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({
                    "userId": testUser._id,
                    "title": "Great Product",
                    "content": "I really liked this product. It exceeded my expectations!",
                    "rating": 5,
                    "images": []
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("_id");
            expect(res.body.title).toBe("Great Product");
            expect(res.body.content).toBe("I really liked this product. It exceeded my expectations!");
            expect(res.body.rating).toBe(5);
            reviewId = res.body._id; // Save for later tests
        });

        test("should fail to create a review without authentication", async () => {
            const res = await request(app)
                .post("/reviews")
                .send({
                    "userId": testUser._id,
                    "title": "Another Great Product",
                    "content": "This is another great product.",
                    "rating": 4,
                    "images": []
                });

            expect(res.status).toBe(401);
        });
    });

    describe("GET /reviews", () => {
        test("should get all reviews", async () => {
            const res = await request(app).get("/reviews");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe("GET /reviews/:id", () => {
        test("should get a review by ID", async () => {
            const res = await request(app).get(`/reviews/${reviewId}`);

            expect(res.status).toBe(200);
            expect(res.body._id).toBe(reviewId);
            expect(res.body.title).toBe("Great Product");
        });

        test("should return 404 for non-existent review", async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const res = await request(app).get(`/reviews/${fakeId}`);

            expect(res.status).toBe(404);
        });
    });

    describe("GET /reviews/paging", () => {
        test("should get reviews with paging", async () => {
            const res = await request(app).get("/reviews/paging?page=1&limit=10");

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("reviews");
            expect(res.body).toHaveProperty("total");
            expect(Array.isArray(res.body.reviews)).toBe(true);
            expect(res.body.total).toBeGreaterThan(0);
        });
    });

    describe("GET /reviews/user/:userId", () => {
        test("should get reviews by user ID", async () => {
            const res = await request(app).get(`/reviews/user/${testUser._id}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe("PUT /reviews/:id", () => {
        test("should update a review", async () => {
            const res = await request(app)
                .put(`/reviews/${reviewId}`)
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({
                    "title": "Updated Review Title",
                    "rating": 4
                });

            expect(res.status).toBe(200);
            expect(res.body.title).toBe("Updated Review Title");
            expect(res.body.rating).toBe(4);
        });
    });

    describe("POST /reviews/:id/like", () => {
        test("should toggle like on a review", async () => {
            const res = await request(app)
                .post(`/reviews/${reviewId}/like`)
                .set("Authorization", `Bearer ${testUser.token}`);

            expect(res.status).toBe(200);
            expect(res.body.likes).toContain(testUser._id);

        });

        test("should toggle like off on a review(unlike)", async () => {
            const res = await request(app)
                .post(`/reviews/${reviewId}/like`)
                .set("Authorization", `Bearer ${testUser.token}`);

            expect(res.status).toBe(200);
            expect(res.body.likes).not.toContain(testUser._id);
        });
    });

    describe("DELETE /reviews/:id", () => {
        test("should delete a review", async () => {
            const res = await request(app)
                .delete(`/reviews/${reviewId}`)
                .set("Authorization", `Bearer ${testUser.token}`);

            expect(res.status).toBe(200);
        });

        test("should return 404 when deleting non-existent review", async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const res = await request(app)
                .delete(`/reviews/${fakeId}`)
                .set("Authorization", `Bearer ${testUser.token}`);

            expect(res.status).toBe(404);
        });
    });
});

