import axios from "axios";

import {
  getNotices,
  getNotice,
  createNotice,
  updateNotice,
  deleteNotice,
} from "./notices";

describe("getNotices", () => {
  it("should return notices", async () => {
    const notices = [{ id: "1", title: "title", content: "content" }];
    jest.spyOn(axios, "get").mockResolvedValue({ data: notices });

    const result = await getNotices();

    expect(result).toEqual(notices);
  });

  it("should return null if an error occurs", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getNotices();

    expect(result).toBeNull();
  });
});

describe("getNotice", () => {
  it("should return a notice", async () => {
    const notice = { id: "1", title: "title", content: "content" };
    jest.spyOn(axios, "get").mockResolvedValue({ data: notice });

    const result = await getNotice("1");

    expect(result).toEqual(notice);
  });

  it("should return null if an error occurs", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getNotice("1");

    expect(result).toBeNull();
  });

  it("should return null if id is undefined", async () => {
    const result = await getNotice(undefined);

    expect(result).toBeNull();
  });
});

describe("createNotice", () => {
  it("should return true", async () => {
    jest.spyOn(axios, "post").mockResolvedValue(null);

    const result = await createNotice("title", "content");

    expect(result).toBe(true);
  });

  it("should return null if an error occurs", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await createNotice("title", "content");

    expect(result).toBeNull();
  });
});

describe("updateNotice", () => {
  it("should return true", async () => {
    jest.spyOn(axios, "put").mockResolvedValue(null);

    const result = await updateNotice("1", "title", "content");

    expect(result).toBe(true);
  });

  it("should return null if an error occurs", async () => {
    jest.spyOn(axios, "put").mockRejectedValue(null);

    const result = await updateNotice("1", "title", "content");

    expect(result).toBeNull();
  });

  it("should return null if id is undefined", async () => {
    const result = await updateNotice(undefined, "title", "content");

    expect(result).toBeNull();
  });
});

describe("deleteNotice", () => {
  it("should return true", async () => {
    jest.spyOn(axios, "delete").mockResolvedValue(null);

    const result = await deleteNotice("1");

    expect(result).toBe(true);
  });

  it("should return null if an error occurs", async () => {
    jest.spyOn(axios, "delete").mockRejectedValue(null);

    const result = await deleteNotice("1");

    expect(result).toBeNull();
  });

  it("should return null if id is undefined", async () => {
    const result = await deleteNotice(undefined);

    expect(result).toBeNull();
  });
});
