import llmService from "../../services/LLM/llmService";

describe("LlmService - generateResponse", () => {
    test("should return a valid JSON response for a clothing search query", async () => {
        const prompt = `You are a search assistant for a clothing store called O&A.
        The user is searching for products. Extract search filters from their query.

        Available categories: shirts, pants, shoes, jackets, dresses, accessories
        Available genders: men, women, unisex
        Available sizes: XS, S, M, L, XL, XXL

        Return ONLY a valid JSON object with these optional fields:
        - "category": string (one of the available categories)
        - "gender": string (men, women, or unisex)
        - "color": string (a color)
        - "size": string (one of the available sizes)
        - "minPrice": number
        - "maxPrice": number
        - "tags": string[] (relevant tags like: cotton, casual, summer, formal, winter, sport)
        - "query": string (general search term if no specific filters match)

        Only include fields that are clearly mentioned or implied in the query.
        If the query is not related to clothing, return: {"query": ""}

        User query: "red summer dress for women under 200"`;

        const result = await llmService.generateResponse(prompt);

        // Verify the response is a valid JSON string
        const parsed = JSON.parse(result);

        // Verify it extracted the color
        expect(parsed).toHaveProperty("color");
        expect(parsed.color.toLowerCase()).toContain("red");

        // Verify it extracted the gender
        expect(parsed).toHaveProperty("gender");
        expect(parsed.gender).toBe("women");

        // Verify it extracted the category
        expect(parsed).toHaveProperty("category");
        expect(parsed.category).toBe("dresses");

        // Verify it extracted max price
        expect(parsed).toHaveProperty("maxPrice");
        expect(parsed.maxPrice).toBeLessThanOrEqual(200);

        // Verify tags include summer
        if (parsed.tags) {
            expect(parsed.tags).toContain("summer");
        }
    }, 30000);

    test("should return empty query for non-clothing search", async () => {
        const prompt = `You are a search assistant for a clothing store called O&A.
        The user is searching for products. Extract search filters from their query.

        Available categories: shirts, pants, shoes, jackets, dresses, accessories
        Available genders: men, women, unisex
        Available sizes: XS, S, M, L, XL, XXL

        Return ONLY a valid JSON object with these optional fields:
        - "category": string (one of the available categories)
        - "gender": string (men, women, or unisex)
        - "color": string (a color)
        - "size": string (one of the available sizes)
        - "minPrice": number
        - "maxPrice": number
        - "tags": string[] (relevant tags like: cotton, casual, summer, formal, winter, sport)
        - "query": string (general search term if no specific filters match)

        Only include fields that are clearly mentioned or implied in the query.
        If the query is not related to clothing, return: {"query": ""}

        User query: "how to cook pasta"`;

        const result = await llmService.generateResponse(prompt);

        const parsed = JSON.parse(result);

        // Non-clothing query should return empty query
        expect(parsed).toHaveProperty("query");
        expect(parsed.query).toBe("");
    }, 30000);
});
