import axios from "axios";

import {
  createComment,
  deleteComment,
  editComment,
  likeComment,
  reportComment,
} from "./comments";

describe("createComment", () => {
  it("should create comment", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({});

    const result = await createComment("1", "content", 1);

    expect(result).toEqual(true);
  });

  it("should return null if params are undefined", async () => {
    const result = await createComment(undefined, "content", undefined);

    expect(result).toBeNull();
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await createComment("1", "content", 1);

    expect(result).toBeNull();
  });
});

describe("deleteComment", () => {
  it("should delete comment", async () => {
    jest.spyOn(axios, "delete").mockResolvedValue({});

    const result = await deleteComment(1);

    expect(result).toEqual(true);
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "delete").mockRejectedValue(null);

    const result = await deleteComment(1);

    expect(result).toBeNull();
  });
});

describe("editComment", () => {
  it("should edit comment", async () => {
    jest.spyOn(axios, "patch").mockResolvedValue({});

    const result = await editComment(1, "content");

    expect(result).toEqual(true);
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(null);

    const result = await editComment(1, "content");

    expect(result).toBeNull();
  });
});

describe("likeComment", () => {
  it("should like comment", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({});

    const result = await likeComment(1, 1);

    expect(result).toEqual(true);
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await likeComment(1, null);

    expect(result).toBeNull();
  });
});

describe("reportComment", () => {
  it("should report comment", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({});

    const result = await reportComment(1, "reason", "content");

    expect(result).toEqual(true);
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await reportComment(1, "reason", "content");

    expect(result).toBeNull();
  });
});
