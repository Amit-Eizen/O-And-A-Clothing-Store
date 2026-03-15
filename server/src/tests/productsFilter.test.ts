import request from "supertest";
import { Express } from "express";
import productsModel from "../models/productsModel";
import userModel from "../models/userModel";
import { initTestApp, createTestUser, registerTestUser, makeAdmin, closeTestDB } from "./testUtils";

let app: Express;

const testUser = createTestUser("filtertestuser", "filtertestuser@example.com");

beforeAll(async () => {
    app = await initTestApp();
    await productsModel.deleteMany();
    await userModel.deleteMany();

    await registerTestUser(testUser);
    await makeAdmin(testUser._id);

    // Create test products for filtering
    const products = [
        { name: "Men Shirt", type: "Shirt", description: "Cotton shirt", price: 100, category: "men", sizes: ["S", "M"], colors: ["black"], images: ["s1.jpg"], stock: 10, tags: ["cotton"] },
        { name: "Men Jacket", type: "Jacket", description: "Winter jacket", price: 250, category: "men", sizes: ["L", "XL"], colors: ["blue"], images: ["j1.jpg"], stock: 5, tags: ["winter"] },
        { name: "Women Dress", type: "Dress", description: "Summer dress", price: 150, category: "women", sizes: ["S", "M"], colors: ["red"], images: ["d1.jpg"], stock: 8, tags: ["summer"] },
        { name: "Women Jeans", type: "Jeans", description: "Slim jeans", price: 180, category: "women", sizes: ["M", "L"], colors: ["blue"], images: ["jn1.jpg"], stock: 12, tags: ["denim"] },
        { name: "Sunglasses", type: "Sunglasses", description: "Cool sunglasses", price: 80, category: "accessories", sizes: ["One Size"], colors: ["black"], images: ["sg1.jpg"], stock: 20, tags: ["summer"] },
    ];

    for (const product of products) {
        await request(app)
            .post("/products")
            .set("Authorization", `Bearer ${testUser.token}`)
            .send(product);
    }
});

afterAll(async () => {
    await closeTestDB();
});

describe("Products Filter API Tests", () => {
    describe("GET /products/filter", () => {
        test("should return all products with pagination info", async () => {
            const res = await request(app).get("/products/filter");

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("products");
            expect(res.body).toHaveProperty("total");
            expect(res.body).toHaveProperty("page");
            expect(res.body).toHaveProperty("limit");
            expect(res.body.total).toBe(5);
        });

        test("should filter by category", async () => {
            const res = await request(app).get("/products/filter?category=men");

            expect(res.status).toBe(200);
            expect(res.body.total).toBe(2);
            for (const product of res.body.products) {
                expect(product.category).toBe("men");
            }
        });

        test("should filter by price range", async () => {
            const res = await request(app).get("/products/filter?minPrice=100&maxPrice=180");

            expect(res.status).toBe(200);
            for (const product of res.body.products) {
                expect(product.price).toBeGreaterThanOrEqual(100);
                expect(product.price).toBeLessThanOrEqual(180);
            }
        });

        test("should filter by size", async () => {
            const res = await request(app).get("/products/filter?sizes=XL");

            expect(res.status).toBe(200);
            expect(res.body.total).toBe(1);
            expect(res.body.products[0].name).toBe("Men Jacket");
        });

        test("should filter by color", async () => {
            const res = await request(app).get("/products/filter?colors=blue");

            expect(res.status).toBe(200);
            expect(res.body.total).toBe(2);
        });

        test("should filter by type", async () => {
            const res = await request(app).get("/products/filter?type=Shirt,Dress");

            expect(res.status).toBe(200);
            expect(res.body.total).toBe(2);
        });

        test("should sort by price low to high", async () => {
            const res = await request(app).get("/products/filter?sort=price-low");

            expect(res.status).toBe(200);
            const prices = res.body.products.map((p: any) => p.price);
            for (let i = 1; i < prices.length; i++) {
                expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
            }
        });

        test("should sort by price high to low", async () => {
            const res = await request(app).get("/products/filter?sort=price-high");

            expect(res.status).toBe(200);
            const prices = res.body.products.map((p: any) => p.price);
            for (let i = 1; i < prices.length; i++) {
                expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
            }
        });

        test("should paginate correctly", async () => {
            const res = await request(app).get("/products/filter?page=1&limit=2");

            expect(res.status).toBe(200);
            expect(res.body.products.length).toBe(2);
            expect(res.body.total).toBe(5);
            expect(res.body.page).toBe(1);
            expect(res.body.limit).toBe(2);
        });

        test("should combine multiple filters", async () => {
            const res = await request(app).get("/products/filter?category=women&minPrice=100&maxPrice=160");

            expect(res.status).toBe(200);
            expect(res.body.total).toBe(1);
            expect(res.body.products[0].name).toBe("Women Dress");
        });

        test("should return empty when no products match", async () => {
            const res = await request(app).get("/products/filter?category=men&minPrice=500");

            expect(res.status).toBe(200);
            expect(res.body.total).toBe(0);
            expect(res.body.products).toEqual([]);
        });
    });

    describe("GET /products/new-arrivals", () => {
        test("should return new arrivals with default limit", async () => {
            const res = await request(app).get("/products/new-arrivals");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeLessThanOrEqual(4);
        });

        test("should respect custom limit", async () => {
            const res = await request(app).get("/products/new-arrivals?limit=2");

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        });
    });
});
