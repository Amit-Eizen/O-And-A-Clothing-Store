import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import userModel from "../models/userModel";
import { initTestApp, createTestUser, registerTestUser, closeTestDB } from "./testUtils";

let app: Express;

const testUser = createTestUser("usertestuser", "usertestuser@example.com");

beforeAll(async () => {
    app = await initTestApp();
    await userModel.deleteMany();
    await registerTestUser(testUser);
});

afterAll(async () => {
    await closeTestDB();
});

describe("Users API Tests", () => {
    describe("GET /users/profile", () => {
        test("should get current user profile", async () => {
            const res = await request(app)
                .get("/users/profile")
                .set("Authorization", `Bearer ${testUser.token}`);

            expect(res.status).toBe(200);
            expect(res.body.username).toBe("usertestuser");
            expect(res.body.email).toBe("usertestuser@example.com");
            expect(res.body).not.toHaveProperty("password");
            expect(res.body).not.toHaveProperty("refreshToken");
        });

        test("should fail without authentication", async () => {
            const res = await request(app).get("/users/profile");
            expect(res.status).toBe(401);
        });
    });

    describe("PUT /users/profile", () => {
        test("should update username", async () => {
            const res = await request(app)
                .put("/users/profile")
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({ username: "updateduser" });

            expect(res.status).toBe(200);
            expect(res.body.username).toBe("updateduser");
        });

        test("should update phone number", async () => {
            const res = await request(app)
                .put("/users/profile")
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({ phoneNumber: "0501234567" });

            expect(res.status).toBe(200);
            expect(res.body.phoneNumber).toBe("0501234567");
        });

        test("should update address", async () => {
            const res = await request(app)
                .put("/users/profile")
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({
                    address: {
                        street: "123 Test St",
                        city: "Tel Aviv",
                        zipCode: "12345",
                        country: "Israel"
                    }
                });

            expect(res.status).toBe(200);
            expect(res.body.address.city).toBe("Tel Aviv");
        });

        test("should not expose password or refreshToken", async () => {
            const res = await request(app)
                .put("/users/profile")
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({ username: "updateduser2" });

            expect(res.status).toBe(200);
            expect(res.body).not.toHaveProperty("password");
            expect(res.body).not.toHaveProperty("refreshToken");
        });

        test("should fail without authentication", async () => {
            const res = await request(app)
                .put("/users/profile")
                .send({ username: "hacker" });

            expect(res.status).toBe(401);
        });
    });

    describe("GET /users/:id", () => {
        test("should get public profile (username and image only)", async () => {
            const res = await request(app)
                .get(`/users/${testUser._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("username");
            expect(res.body).not.toHaveProperty("email");
            expect(res.body).not.toHaveProperty("password");
        });

        test("should return 404 for non-existent user", async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const res = await request(app).get(`/users/${fakeId}`);

            expect(res.status).toBe(404);
        });
    });
});
