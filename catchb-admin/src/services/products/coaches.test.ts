import axios from "axios";

import { getCoaches, approveCoach, rejectCoach } from "./coaches";

describe("getCoaches", () => {
  it("should return the coaches", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const result = await getCoaches("pending");

    expect(result).toEqual({});
  });

  it("should return null when the request fails", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getCoaches("pending");

    expect(result).toBeNull();
  });
});

describe("approveCoach", () => {
  it("should return the data when the request is successful", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: {} });

    const result = await approveCoach("1");

    expect(result).toEqual({});
  });

  it("should return null when the request fails", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await approveCoach("1");

    expect(result).toBeNull();
  });
});

describe("rejectCoach", () => {
  it("should return the data when the request is successful", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: {} });

    const result = await rejectCoach("1", "Reason");

    expect(result).toEqual({});
  });

  it("should return null when the request fails", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await rejectCoach("1", "Reason");

    expect(result).toBeNull();
  });
});
