import request from "supertest";
import initApp from "../app";
import { Express } from "express";
import mongoose from "mongoose";
import commentsModel from "../models/commentsModel";
import reviewsModel from "../models/reviewsModel";
import userModel from "../models/userModel";

let app: Express;

const testUser = {
    username: "testuser",
    email: "testuser@example.com",
    password: "testpassword",
    token: "",
    refreshToken: "",
    _id: ""
};

let reviewId: string;
let commentId: string;

beforeAll(async () => {
    app = await initApp();
    await commentsModel.deleteMany();
    await reviewsModel.deleteMany();
    await userModel.deleteMany();

    // Register a test user and get tokens
    const response = await request(app)
        .post("/register")
        .send({
            "username": testUser.username,
            "email": testUser.email,
            "password": testUser.password
        });

    testUser.token = response.body.token;
    testUser.refreshToken = response.body.refreshToken;
    
    const payload = JSON.parse(Buffer.from(testUser.token.split(".")[1], "base64").toString());
    testUser._id = payload._id;

    // Create a test review
    const reviewResponse = await request(app)
        .post("/reviews")
        .set("Authorization", `Bearer ${testUser.token}`)
        .send({
            title: "Test Review",
            content: "This is a test review.",
            rating: 5
        });
    reviewId = reviewResponse.body._id;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Comments API Tests", () => {
    describe("POST /comments", () => {
        test("should create a new comment", async () => {
            const response = await request(app)
                .post("/comments")
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({
                    reviewId: reviewId,
                    content: "This is a test comment."
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("_id");
            expect(response.body.content).toBe("This is a test comment.");
            expect(response.body.userId).toBe(testUser._id);
            expect(response.body.reviewId).toBe(reviewId);
            commentId = response.body._id;
        });

        test("should fail to create comment without authentication", async () => {
            const response = await request(app)
                .post("/comments")
                .send({
                    reviewId: reviewId,
                    content: "This comment should not be created."
                });

            expect(response.status).toBe(401);
        });
    });

    describe("GET /comments/review/:reviewId", () => {
        test("should get comments by review ID", async () => {
            const response = await request(app)
                .get(`/comments/review/${reviewId}`)
                
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].content).toBe("This is a test comment.");
        });

        test("should return empty array for review with no comments", async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const response = await request(app)
                .get(`/comments/review/${fakeId}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe("PUT /comments/:id", () => {
        test("should update a comment", async () => {
            const response = await request(app)
                .put(`/comments/${commentId}`)
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({
                    content: "Updated comment content."
                });

            expect(response.status).toBe(200);
            expect(response.body.content).toBe("Updated comment content.");
        });
    });

    describe("DELETE /comments/:id", () => {
        test("should delete a comment", async () => {
            const response = await request(app)
                .delete(`/comments/${commentId}`)
                .set("Authorization", `Bearer ${testUser.token}`);

            expect(response.status).toBe(200);
        });

        test("should return 404 for already deleted comment", async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const response = await request(app)
                .delete(`/comments/${fakeId}`)
                .set("Authorization", `Bearer ${testUser.token}`);

            expect(response.status).toBe(404);
        });
    });
});
    
            