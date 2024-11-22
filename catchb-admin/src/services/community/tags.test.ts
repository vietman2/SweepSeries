import axios from "axios";

import { getTag, getTags } from "./tags";

describe("getTags", () => {
  it("should return an array of tags if the request is successful", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: [] });

    const response = await getTags();

    expect(response).toEqual([]);
  });

  it("should return null if the request is unsuccessful", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());

    const response = await getTags();

    expect(response).toBeNull();
  });
});

describe("getTag", () => {
  it("should return a tag object if the request is successful", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const response =await getTag("1");

    expect(response).toEqual({});
  });

  it("should return null if tagId is undefined", async () => {
    const response = await getTag(undefined);

    expect(response).toBeNull();
  });

  it("should return null if the request is unsuccessful", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());

    const response = await getTag("1");

    expect(response).toBeNull();
  });
});
