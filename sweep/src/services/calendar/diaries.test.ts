import axios from "axios";

import { createDiary } from "./diaries";

describe("createDiary", () => {
  jest.spyOn(axios, "post").mockResolvedValue({ data: {} });

  it("should return the diary when it is created", async () => {
    const result = await createDiary("diary", "2021-01-01");

    expect(result).toEqual({});
  });

  it("should return null when the request fails", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(new Error());

    const result = await createDiary("diary", "2021-01-01");

    expect(result).toBe(null);
  });
});
