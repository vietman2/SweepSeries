import axios from "axios";

import { createCoach } from "./coach";

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
