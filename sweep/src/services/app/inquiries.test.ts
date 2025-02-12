import axios from "axios";

import { getInquiries, createInquiry } from "./inquiries";

describe("getInquiries", () => {
  it("should return an array of inquiries", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const inquiries = await getInquiries();

    expect(inquiries).toEqual({});
  });

  it("should return null when an error occurs", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());

    const inquiries = await getInquiries();

    expect(inquiries).toBe(null);
  });
});

describe("createInquiry", () => {
  it("should return true when creating an inquiry", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({});

    const result = await createInquiry(
      "Test Inquiry",
      "This is a test inquiry."
    );

    expect(result).toBe(true);
  });

  it("should return null when an error occurs", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(new Error());

    const result = await createInquiry("", "");

    expect(result).toBe(null);
  });
});
