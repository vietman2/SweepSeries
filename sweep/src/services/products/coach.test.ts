import axios from "axios";

import { createCoach, getCoaches, getEmployedCoaches, acceptCoach, rejectCoach } from "./coach";

jest.mock("form-data", () => {
  return jest.fn().mockImplementation(() => {
    return {
      append: jest.fn(),
    };
  });
});

describe("createCoach", () => {
  const file = {
    uri: "uri",
    fileName: "fileName",
    width: 1,
    height: 1,
  };

  it("should create a coach", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: {} });

    const result = await createCoach("career", "academy", file, file, [
      "profession",
    ]);

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await createCoach("career", "academy", file, file, [
      "profession",
    ]);

    expect(result).toBeNull();
  });
});

describe("getCoaches", () => {
  it("should get coaches", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const result = await getCoaches("academyId");

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getCoaches("academyId");

    expect(result).toBeNull();
  });
});

describe("getEmployedCoaches", () => {
  it("should get employed coaches", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const result = await getEmployedCoaches("academyId");

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getEmployedCoaches("academyId");

    expect(result).toBeNull();
  });
});

describe("acceptCoach", () => {
  it("should accept a coach", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: {} });

    const result = await acceptCoach("coachId");

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await acceptCoach("coachId");

    expect(result).toBeNull();
  });
});

describe("rejectCoach", () => {
  it("should reject a coach", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: {} });

    const result = await rejectCoach("coachId");

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await rejectCoach("coachId");

    expect(result).toBeNull();
  });
});
