import axios from "axios";

import { getTag, getTags, createTag, deleteTag, updateTag } from "./tags";

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

    const response = await getTag("1");

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

describe("createTag", () => {
  it("should return a tag object if the request is successful", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: {} });

    const response = await createTag(
      "forum",
      "label",
      "icon",
      "color",
      "bgColor"
    );

    expect(response).toEqual({});
  });

  it("should return null if the request is unsuccessful", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(new Error());

    const response = await createTag(
      "forum",
      "label",
      "icon",
      "color",
      "bgColor"
    );

    expect(response).toBeNull();
  });
});

describe("deleteTag", () => {
  it("should return true if the request is successful", async () => {
    jest.spyOn(axios, "delete").mockResolvedValue({});

    const response = await deleteTag("1");

    expect(response).toBe(true);
  });

  it("should return null if tagId is undefined", async () => {
    const response = await deleteTag(undefined);

    expect(response).toBeNull();
  });

  it("should return null if the request is unsuccessful", async () => {
    jest.spyOn(axios, "delete").mockRejectedValue(new Error());

    const response = await deleteTag("1");

    expect(response).toBeNull();
  });
});

describe("updateTag", () => {
  it("should return a tag object if the request is successful", async () => {
    jest.spyOn(axios, "patch").mockResolvedValue({ data: {} });

    const response = await updateTag("1", "label", "icon", "color", "bgColor");

    expect(response).toEqual({});
  });

  it("should return null if tagId is undefined", async () => {
    const response = await updateTag(
      undefined,
      "label",
      "icon",
      "color",
      "bgColor"
    );

    expect(response).toBeNull();
  });

  it("should return null if the request is unsuccessful", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(new Error());

    const response = await updateTag("1", "label", "icon", "color", "bgColor");

    expect(response).toBeNull();
  });
});
