import axios from "axios";

import { getPromodeProfiles } from "./profiles";

describe("getPromodeProfiles", () => {
  it("should return data when the request is successful", async () => {
    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: {} });

    const result = await getPromodeProfiles();

    expect(result).toEqual({});
  });

  it("should return null when the request fails", async () => {
    jest.spyOn(axios, "get").mockRejectedValueOnce(new Error("Network error"));

    const result = await getPromodeProfiles();

    expect(result).toBeNull();
  });
});
