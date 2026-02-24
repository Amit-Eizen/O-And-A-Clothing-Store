import request from "supertest";
import initApp from "../app";
import { Express } from "express";
import user from "../models/userModel";
import mongoose from "mongoose";

let app: Express;

const testUser = {
    username: "testuser",
    email: "test@example.com",
    password: "Test123!",
    token: "",
    refreshToken: "",
    _id: ""
};

beforeAll(async () => {
    app = await initApp();
    await user.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Auth API Tests", () => {
    describe("POST /register", () => {
        test("should register a new user and return tokens", async () => {
            const response = await request(app)
                .post("/register")
                .send({
                    "username": testUser.username,
                    "email": testUser.email,
                    "password": testUser.password
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("token");
            expect(response.body).toHaveProperty("refreshToken");

            testUser.token = response.body.token;
            testUser.refreshToken = response.body.refreshToken;
        });

        test("should fail to register user with existing email", async () => {
            const response = await request(app)
                .post("/register")
                .send({
                    "username": "anotheruser",
                    "email": testUser.email,
                    "password": "Another123!"
                });
            expect(response.status).toBe(400);
        });
    });

    describe("POST /login", () => {
        test("should login an existing user and return tokens", async () => {
            const response = await request(app)
                .post("/login")
                .send({
                    "email": testUser.email,
                    "password": testUser.password
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("token");
            expect(response.body).toHaveProperty("refreshToken");
        });

        test("should fail to login with incorrect password", async () => {
            const response = await request(app)
                .post("/login")
                .send({
                    "email": testUser.email,
                    "password": "WrongPassword!"
                });
            expect(response.status).toBe(401);
        });
    });

    describe("POST /refresh-token", () => {
        test("should refresh tokens with valid refresh token", async () => {
            const response = await request(app)
                .post("/refresh-token")
                .send({
                    "refreshToken": testUser.refreshToken
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("token");
            expect(response.body).toHaveProperty("refreshToken");

            testUser.token = response.body.token;
            testUser.refreshToken = response.body.refreshToken;
        });

        test("should fail to refresh tokens with invalid refresh token", async () => {
            const oldRefreshToken = testUser.refreshToken;

            //First refresh - should succeed
            const firstRefresh = await request(app)
                .post("/refresh-token")
                .send({
                    "refreshToken": oldRefreshToken
                });
            expect(firstRefresh.status).toBe(200);
            testUser.refreshToken = firstRefresh.body.refreshToken;

            //Second refresh with old token - should fail
            const secondRefresh = await request(app)
                .post("/refresh-token")
                .send({
                    "refreshToken": oldRefreshToken
                });
            expect(secondRefresh.status).toBe(401);
        });
    });

    describe("POST /logout", () => {
        beforeEach(async () => {
            // Login to get fresh tokens before each logout test
            const response = await request(app)
                .post("/login")
                .send({
                    "email": testUser.email,
                    "password": testUser.password
                });

            testUser.token = response.body.token;
            testUser.refreshToken = response.body.refreshToken;
        });

        test("should logout user with valid refresh token", async () => {
            const response = await request(app)
                .post("/logout")
                .send({
                    "refreshToken": testUser.refreshToken
                });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("success", true);
        });

        test("should fail to refresh tokens after logout", async () => {
            await request(app)
                .post("/logout")
                .send({
                    "refreshToken": testUser.refreshToken
                });

            const refreshResponse = await request(app)
                .post("/refresh-token")
                .send({
                    "refreshToken": testUser.refreshToken
                });
            expect(refreshResponse.status).toBe(401);
        });
    });
});



