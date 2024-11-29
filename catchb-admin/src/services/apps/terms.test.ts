import axios from "axios";

import { getTerms } from "./terms";

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
