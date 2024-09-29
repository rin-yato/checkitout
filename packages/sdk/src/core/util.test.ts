import { describe, it, mock, expect, beforeEach, afterEach } from "bun:test";
import { type Api, createApiCall } from "./util";

const mockFetch = mock();
global.fetch = mockFetch;
mock.module("node-fetch", () => mockFetch);

describe("createApiCall", () => {
  let apiCall: Api;

  beforeEach(() => {
    apiCall = createApiCall();
  });

  afterEach(() => {
    mockFetch.mockClear();
  });

  describe("Successful API call", () => {
    it("should return an ApiResponseSuccess object", async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ id: 1, name: "Test" }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await apiCall("/api/test", {});

      expect(result.data).toEqual({ id: 1, name: "Test" });
      expect(result.error).toBeNull();
      expect(result.response).toBeDefined();
    });
  });

  describe("Failed API call", () => {
    it("should return an ApiResponseError object", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        json: async () => ({ message: "Not found", status: 404 }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await apiCall("/api/nonexistent", {});

      expect(result.error).toBeDefined();
      expect(result?.error?.status).toBe(404);
      expect(result?.error?.message).toBe("Not found");
      expect(result.data).toBeNull();
      expect(result.response).toBeDefined();
    });
  });

  describe("Network Error", () => {
    it("should handle network errors", async () => {
      // will console.error "CHECKITOUT_ERROR Network error (TEST, EXPECTED)"
      mockFetch.mockRejectedValue("Network error (TEST, EXPECTED)");

      const result = await apiCall("/api/error", {});

      expect(result.error).toBeDefined();
      expect(result.error?.status).toBe(500);
      expect(result.error?.message).toBe("Something went wrong.");
      expect(result.data).toBeNull();
      expect(result.response).toBeUndefined();
    });
  });
});
