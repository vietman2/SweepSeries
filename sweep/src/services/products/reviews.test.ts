import axios from "axios";

import { getReviews, getTagOptions } from "./reviews";

describe("getReviews", () => {
  it("should return reviews", async () => {
    const reviews = [{ id: 1, content: "Great product!" }];
    axios.get = jest.fn().mockResolvedValue({ data: reviews });

    const result = await getReviews();

    expect(result).toEqual(reviews);
  });

  it("should return null if request fails", async () => {
    axios.get = jest.fn().mockRejectedValue(null);

    const result = await getReviews();

    expect(result).toBeNull();
  });
});

describe("getTagOptions", () => {
  it("should return tag options", async () => {
    const tagOptions = [{ id: 1, name: "Great" }];
    axios.get = jest.fn().mockResolvedValue({ data: tagOptions });

    const result = await getTagOptions();

    expect(result).toEqual(tagOptions);
  });

  it("should return null if request fails", async () => {
    axios.get = jest.fn().mockRejectedValue(null);

    const result = await getTagOptions();

    expect(result).toBeNull();
  });
});
