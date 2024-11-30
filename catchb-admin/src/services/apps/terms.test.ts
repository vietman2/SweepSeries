import axios from "axios";

import { createTerms, getTerms } from "./terms";

describe("createTerms", () => {
  it("should successfully create terms", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({
      status: 200,
    });

    const response = await createTerms("Title", "Content", true);

    expect(response).toBe(true);
  });

  it("should handle server error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const response = await createTerms("Title", "Content", true);

    expect(response).toBe(null);
  });

  it("should handle undefined content", async () => {
    const response = await createTerms("Title", undefined, true);

    expect(response).toBe(null);
  });
});

describe("getTerms", () => {
  it("should successfully get terms", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({
      status: 200,
      data: "Terms",
    });

    const response = await getTerms();

    expect(response).toBe("Terms");
  });

  it("should handle server error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const response = await getTerms();

    expect(response).toBe(null);
  });
});
