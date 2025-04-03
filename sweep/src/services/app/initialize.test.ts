import axios from "axios";

import { initialize } from "./initialize";

describe("initialize", () => {
  it("should return the response data on success", async () => {
    const mockData = { key: "value" };
    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: mockData });

    const result = await initialize();

    expect(result).toEqual(mockData);
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValueOnce(new Error("Network error"));

    const result = await initialize();

    expect(result).toBeNull();
  });
});
