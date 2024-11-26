import axios from "axios";

import { likeRecomment } from "./recomments";

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
