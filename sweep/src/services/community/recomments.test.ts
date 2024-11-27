import axios from "axios";

import {
  createRecomment,
  deleteRecomment,
  editRecomment,
  likeRecomment,
} from "./recomments";

describe("createRecomment", () => {
  it("should create recomment", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({});

    const result = await createRecomment(1, "content", 1);

    expect(result).toEqual(true);
  });

  it("should return null if params are undefined", async () => {
    const result = await createRecomment(undefined, "content", undefined);

    expect(result).toBeNull();
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await createRecomment(1, "content", 1);

    expect(result).toBeNull();
  });
});

describe("deleteRecomment", () => {
  it("should delete recomment", async () => {
    jest.spyOn(axios, "delete").mockResolvedValue({});

    const result = await deleteRecomment(1);

    expect(result).toEqual(true);
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "delete").mockRejectedValue(null);

    const result = await deleteRecomment(1);

    expect(result).toBeNull();
  });
});

describe("editRecomment", () => {
  it("should edit recomment", async () => {
    jest.spyOn(axios, "patch").mockResolvedValue({});

    const result = await editRecomment(1, "content");

    expect(result).toEqual(true);
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(null);

    const result = await editRecomment(1, "content");

    expect(result).toBeNull();
  });
});

describe("likeComment", () => {
  it("should like comment", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({});

    const result = await likeRecomment(1, 1);

    expect(result).toEqual(true);
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await likeRecomment(1, null);

    expect(result).toBeNull();
  });
});
