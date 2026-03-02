import { Request, Response } from "express";
import searchController from "../../controllers/searchController";

// Mock the services
jest.mock("../../services/LLM/searchService", () => ({
    __esModule: true,
    default: {
        smartSearch: jest.fn()
    }
}));

jest.mock("../../services/LLM/llmService", () => ({
    __esModule: true,
    default: {
        generateResponse: jest.fn()
    }
}));

import searchService from "../../services/LLM/searchService";
import llmService from "../../services/LLM/llmService";

const mockSearchService = searchService as jest.Mocked<typeof searchService>;
const mockLlmService = llmService as jest.Mocked<typeof llmService>;

describe("SearchController - smartSearch Unit Tests", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });

        mockRequest = {
            query: {}
        };

        mockResponse = {
            status: mockStatus,
            json: mockJson
        };

        mockSearchService.smartSearch.mockResolvedValue([]);
    });

    describe("Input Validation", () => {
        it("should return 400 when query parameter q is missing", async () => {
            mockRequest.query = {};

            await searchController.smartSearch(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: "Search query is required" });
        });

         test("should return 400 when query parameter q is empty string", async () => {
            mockRequest.query = { q: "" };

            await searchController.smartSearch(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: "Search query is required" });
        });
    });

    describe("Successful Search Flow", () => {
        test("should return 200 with empty results when no products match", async () => {
            mockRequest.query = { q: "purple winter boots" };
            mockSearchService.smartSearch.mockResolvedValue([]);

            await searchController.smartSearch(mockRequest as Request, mockResponse as Response);

            expect(mockSearchService.smartSearch).toHaveBeenCalledWith("purple winter boots");
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith([]);
        });

        test("should return 200 with products when search matches", async () => {
            const mockProducts = [
                { _id: "1", name: "Red Summer Dress", price: 150, category: "dresses" },
                { _id: "2", name: "Red Party Dress", price: 200, category: "dresses" }
            ];
            mockRequest.query = { q: "red dress" };
            mockSearchService.smartSearch.mockResolvedValue(mockProducts);

            await searchController.smartSearch(mockRequest as Request, mockResponse as Response);

            expect(mockSearchService.smartSearch).toHaveBeenCalledWith("red dress");
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockProducts);
        });

        test("should pass the exact query string to smartSearch", async () => {
            mockRequest.query = { q: "casual cotton shirt for men under 100" };

            await searchController.smartSearch(mockRequest as Request, mockResponse as Response);

            expect(mockSearchService.smartSearch).toHaveBeenCalledWith("casual cotton shirt for men under 100");
        });
    });

    describe("Error Handling", () => {
        test("should return 500 when smartSearch throws an error", async () => {
            mockRequest.query = { q: "test query" };
            mockSearchService.smartSearch.mockRejectedValue(new Error("LLM service unavailable"));

            await searchController.smartSearch(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: "Smart search failed" });
        });
    });
});