import axios from "axios";

import { getPosts } from "./posts";

describe("getPosts", () => {
    const posts = [{ id: 1, title: "Test Post" }];
    const response = { data: posts };

  it("should fetch posts", async () => {
    jest.spyOn(axios, "get").mockResolvedValue(response);

    const result = await getPosts();

    expect(result).toEqual(posts);
  });
    
  it("should fetch posts with forum", async () => {
    jest.spyOn(axios, "get").mockResolvedValue(response);

    const result = await getPosts("forum");

    expect(result).toEqual(posts);
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getPosts();

    expect(result).toBeNull();
  });
});
