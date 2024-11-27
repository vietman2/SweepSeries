import axios from "axios";

import { getPostDetail, getPosts, likePost } from "./posts";

describe("getPosts", () => {
  const posts = [{ id: 1, title: "Test Post" }];
  const response = { data: posts };

  it("should fetch posts", async () => {
    jest.spyOn(axios, "get").mockResolvedValue(response);

    const result = await getPosts();

    expect(result).toEqual(posts);
  });

  it("should fetch posts with queries", async () => {
    jest.spyOn(axios, "get").mockResolvedValue(response);

    const result = await getPosts("forum", 1, "search");

    expect(result).toEqual(posts);
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getPosts();

    expect(result).toBeNull();
  });
});

describe("getPostDetail", () => {
  const post = { id: 1, title: "Test Post" };
  const response = { data: post };

  it("should fetch post detail", async () => {
    jest.spyOn(axios, "get").mockResolvedValue(response);

    const result = await getPostDetail("1", 1);

    expect(result).toEqual(post);
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getPostDetail("1", null);

    expect(result).toBeNull();
  });
});

describe("likePost", () => {
  it("should like post", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({});

    const result = await likePost("1", 1);

    expect(result).toEqual(true);
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await likePost("1", null);

    expect(result).toBeNull();
  });
});
