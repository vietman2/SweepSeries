import axios from "axios";

import { getFAQ, getFAQs, createFAQ, deleteFAQ, updateFAQ } from "./faqs";

describe("getFAQs", () => {
  it("should return an array of FAQs", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({
      data: [],
    });
    const response = await getFAQs("category");
    expect(response).toEqual([]);
  });

  it("should return null if an error occurs", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);
    const response = await getFAQs("category");
    expect(response).toBeNull();
  });
});

describe("getFAQ", () => {
  it("should return a FAQ", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({
      data: {},
    });
    const response = await getFAQ("1");
    expect(response).toEqual({});
  });

  it("should return null if an error occurs", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);
    const response = await getFAQ("1");
    expect(response).toBeNull();
  });

  it("should return null if faqId is undefined", async () => {
    const response = await getFAQ(undefined);
    expect(response).toBeNull();
  });
});

describe("createFAQ", () => {
  it("should return a FAQ", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({
      data: {},
    });
    const response = await createFAQ("category", "question", "answer");
    expect(response).toEqual({});
  });

  it("should return null if an error occurs", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);
    const response = await createFAQ("category", "question", "answer");
    expect(response).toBeNull();
  });
});

describe("updateFAQ", () => {
  it("should return a FAQ", async () => {
    jest.spyOn(axios, "put").mockResolvedValue({
      data: {},
    });
    const response = await updateFAQ("1", "question", "answer");
    expect(response).toEqual({});
  });

  it("should return null if an error occurs", async () => {
    jest.spyOn(axios, "put").mockRejectedValue(null);
    const response = await updateFAQ("1", "question", "answer");
    expect(response).toBeNull();
  });

  it("should return null if faqId is undefined", async () => {
    const response = await updateFAQ(undefined, "question", "answer");
    expect(response).toBeNull();
  });
});

describe("deleteFAQ", () => {
  it("should return true", async () => {
    jest.spyOn(axios, "delete").mockResolvedValue({
      data: {},
    });
    const response = await deleteFAQ("1");
    expect(response).toBe(true);
  });

  it("should return null if faqId is undefined", async () => {
    const response = await deleteFAQ(undefined);
    expect(response).toBeNull();
  });

  it("should return null if an error occurs", async () => {
    jest.spyOn(axios, "delete").mockRejectedValue(null);
    const response = await deleteFAQ("1");
    expect(response).toBeNull();
  });
});
