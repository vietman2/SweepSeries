import axios from "axios";

import {
  getTargets,
  getPositions,
  getPrograms,
  createProgram,
  getProgramsByProfile,
} from "./programs";

describe("getTargets", () => {
  it("should return the targets", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });
    const result = await getTargets();
    expect(result).toEqual({});
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());
    const result = await getTargets();
    expect(result).toBeNull();
  });
});

describe("getPositions", () => {
  it("should return the positions", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });
    const result = await getPositions();
    expect(result).toEqual({});
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());
    const result = await getPositions();
    expect(result).toBeNull();
  });
});

describe("getPrograms", () => {
  it("should return the programs", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });
    const result = await getPrograms("uuid");
    expect(result).toEqual({});
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());
    const result = await getPrograms("uuid");
    expect(result).toBeNull();
  });
});

describe("createProgram", () => {
  it("should create a program", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: {} });
    const result = await createProgram(
      "uuid",
      "name",
      1,
      1,
      [1],
      [{ num_lessons: 1, price: 1 }]
    );
    expect(result).toEqual({});
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(new Error());
    const result = await createProgram(
      "uuid",
      "name",
      1,
      1,
      [1],
      [{ num_lessons: 1, price: 1 }]
    );
    expect(result).toBeNull();
  });
});

describe("getProgramsByProfile", () => {
  it("should return the programs", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });
    const result = await getProgramsByProfile(1);
    expect(result).toEqual({});
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());
    const result = await getProgramsByProfile(1);
    expect(result).toBeNull();
  });

  it("should return null if the profile is undefined", async () => {
    const result = await getProgramsByProfile(undefined);
    expect(result).toBeNull();
  });
});
