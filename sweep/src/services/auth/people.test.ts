import axios from "axios";

import { searchPerson } from "./people";

describe("searchPerson", () => {
  it("should return the person if found", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: "person" });

    const result = await searchPerson("1234567890");

    expect(result).toBe("person");
  });

  it("should return NOT_FOUND if the person is not found", async () => {
    jest.spyOn(axios, "isAxiosError").mockReturnValue(true);
    jest.spyOn(axios, "get").mockRejectedValue({ response: { status: 404 } });

    const result = await searchPerson("1234567890");

    expect(result).toBe("NOT_FOUND");
  });

  it("should return null if an axios error occurs", async () => {
    jest.spyOn(axios, "isAxiosError").mockReturnValue(true);
    jest.spyOn(axios, "get").mockRejectedValue({ response: { status: 500 } });

    const result = await searchPerson("1234567890");

    expect(result).toBeNull();
  });

  it("should return null if an unknown error occurs", async () => {
    jest.spyOn(axios, "isAxiosError").mockReturnValue(false);
    jest.spyOn(axios, "get").mockRejectedValue(new Error("error"));

    const result = await searchPerson("1234567890");

    expect(result).toBeNull();
  });
});
