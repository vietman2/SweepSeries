import axios from "axios";

import { getFAQs } from "./faqs";

describe("getFAQs", () => {
  it("should return response data when successful", async () => {
    const response = { data: "test" };
    jest.spyOn(axios, "get").mockResolvedValue(response);

    const result = await getFAQs("test");

    expect(result).toBe(response.data);
  });

  it("should return null when unsuccessful", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getFAQs("test");

    expect(result).toBe(null);
  });
});
