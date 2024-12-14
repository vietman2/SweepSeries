import axios from "axios";

import { createNotice, getNotices } from "./notices";

describe("createNotice", () => {
  it("should create a notice", async () => {
    const academyId = "1";
    const title = "title";
    const content = "content";

    const response = { data: "data" };
    jest.spyOn(axios, "post").mockResolvedValue(response);

    const result = await createNotice(academyId, title, content);

    expect(result).toEqual(response.data);
  });

  it("should return null when an error occurs", async () => {
    const academyId = "1";
    const title = "title";
    const content = "content";

    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await createNotice(academyId, title, content);

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
