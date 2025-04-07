import axios from "axios";

import { getPrivacyPolicy, getTermsOfService } from "./terms";

describe("getTermsOfService", () => {
  it("should return terms of service data", async () => {
    const mockData = { version: 1, content: "Terms of Service" };
    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: mockData });

    const result = await getTermsOfService(null);

    expect(result).toEqual(mockData);
  });

    it("should return terms of service with specified version", async () => {
        const mockData = { version: 1, content: "Terms of Service" };
        jest.spyOn(axios, "get").mockResolvedValueOnce({ data: mockData });
    
        const result = await getTermsOfService(1);
    
        expect(result).toEqual(mockData);
    });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValueOnce(new Error("Network Error"));

    const result = await getTermsOfService(null);

    expect(result).toBeNull();
  });
});

describe("getPrivacyPolicy", () => {
  it("should return privacy policy data", async () => {
    const mockData = { version: 1, content: "Privacy Policy" };
    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: mockData });

    const result = await getPrivacyPolicy(null);

    expect(result).toEqual(mockData);
  });
  
  it("should return privacy policy with specified version", async () => {
    const mockData = { version: 1, content: "Privacy Policy" };
    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: mockData });

    const result = await getPrivacyPolicy(1);

    expect(result).toEqual(mockData);
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValueOnce(new Error("Network Error"));

    const result = await getPrivacyPolicy(null);

    expect(result).toBeNull();
  });
});
