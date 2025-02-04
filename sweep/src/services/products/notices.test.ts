import axios from "axios";

import { createNotice, getNotices, getNotice, deleteNotice, editNotice } from "./notices";

jest.mock("form-data", () => {
  return jest.fn().mockImplementation(() => {
    return {
      append: jest.fn(),
    };
  });
});

describe("createNotice", () => {
  const mockImage = {
    uri: "uri",
    fileName: "fileName",
    width: 1,
    height: 1,
  };

  it("should create a notice", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: "data" });

    const result = await createNotice(
      "1",
      "type",
      "title",
      "content",
      mockImage
    );

    expect(result).toEqual("data");
  });

  it("should return null when an error occurs", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await createNotice(
      "1",
      "type",
      "title",
      "content",
      undefined
    );

    expect(result).toBeNull();
  });
});

describe("getNotices", () => {
  it("should get notices", async () => {
    const academyId = "1";

    const response = { data: "data" };
    jest.spyOn(axios, "get").mockResolvedValue(response);

    const result = await getNotices(academyId);

    expect(result).toEqual(response.data);
  });

  it("should return null when an error occurs", async () => {
    const academyId = "1";

    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getNotices(academyId);

    expect(result).toBeNull();
  });
});

describe("getNotice", () => {
  it("should get a notice", async () => {
    const response = { data: "data" };
    jest.spyOn(axios, "get").mockResolvedValue(response);

    const result = await getNotice("1", "2");

    expect(result).toEqual(response.data);
  });

  it("should return null when an error occurs", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getNotice("1", "2");

    expect(result).toBeNull();
  });
});

describe("deleteNotice", () => {
  it("should delete a notice", async () => {
    jest.spyOn(axios, "delete").mockResolvedValue({ data: "data" });

    const result = await deleteNotice("1", "2");

    expect(result).toEqual(true);
  });

  it("should return null when an error occurs", async () => {
    jest.spyOn(axios, "delete").mockRejectedValue(null);

    const result = await deleteNotice("1", "2");

    expect(result).toBeNull();
  });
});

describe("editNotice", () => {
  it("should edit a notice", async () => {
    const response = { data: "data" };
    jest.spyOn(axios, "patch").mockResolvedValue(response);

    const result = await editNotice("1", "2", "title", "content");

    expect(result).toEqual(response.data);
  });

  it("should return null when an error occurs", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(null);

    const result = await editNotice("1", "2", "title", "content");

    expect(result).toBeNull();
  });
});
