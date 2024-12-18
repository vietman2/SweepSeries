import axios from "axios";

import { getTerms } from "./terms";

describe("getTerms", () => {
  it("should fetch terms", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const result = await getTerms("query", 1);

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getTerms("query", 1);

    expect(result).toBeNull();
  });
});
