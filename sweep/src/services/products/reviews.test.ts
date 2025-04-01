import axios from "axios";

import {
  getReviews,
  getTagOptions,
  createReview,
  getAcademyReviews,
  getAcademyReviewSummary,
  getCoachReviews,
} from "./reviews";

jest.mock("form-data", () => {
  return jest.fn().mockImplementation(() => {
    return {
      append: jest.fn(),
    };
  });
});

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

describe("createReview", () => {
  const defaultReviewInput = {
    rating: 5,
    tagIds: [1],
    comment: "Great product!",
    images: [
      {
        uri: "imageuri/1",
        width: 100,
        height: 100,
      },
    ],
  };

  it("handles missing ratings", async () => {
    const response = await createReview(
      "s1",
      { ...defaultReviewInput, rating: 0 },
      defaultReviewInput,
      defaultReviewInput
    );

    expect(response.status).toBe(400);
    expect(response.data.error).toBe("평점을 모두 선택해주세요.");
  });

  it("handles missing tags", async () => {
    const response = await createReview(
      "s1",
      { ...defaultReviewInput, tagIds: [] },
      defaultReviewInput,
      defaultReviewInput
    );

    expect(response.status).toBe(400);
    expect(response.data.error).toBe("리뷰 키워드를 최소 1개씩 선택해주세요.");
  });

  it("handles invalid comment length", async () => {
    const response = await createReview(
      "s1",
      { ...defaultReviewInput, comment: "tooshort" },
      defaultReviewInput,
      defaultReviewInput
    );

    expect(response.status).toBe(400);
    expect(response.data.error).toBe(
      "후기는 10자 이상, 500자 이하로 작성해주세요."
    );
  });

  it("handles success", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ status: 201, data: {} });

    const response = await createReview(
      "s1",
      defaultReviewInput,
      defaultReviewInput,
      defaultReviewInput
    );

    expect(response.status).toBe(201);
  });

  it("handles bad response", async () => {
    jest.spyOn(axios, "post").mockRejectedValue({ status: 400, data: {} });

    const response = await createReview(
      "s1",
      defaultReviewInput,
      defaultReviewInput,
      defaultReviewInput
    );

    expect(response.status).toBe(400);
  });
});

describe("getAcademyReviews", () => {
  it("should return academy reviews", async () => {
    const reviews = [{ id: 1, content: "Great product!" }];
    axios.get = jest.fn().mockResolvedValue({ data: reviews });

    const result = await getAcademyReviews("1");

    expect(result).toEqual(reviews);
  });

  it("should return null if request fails", async () => {
    axios.get = jest.fn().mockRejectedValue(null);

    const result = await getAcademyReviews("1");

    expect(result).toBeNull();
  });
});

describe("getAcademyReviewSummary", () => {
  it("should return academy review summary", async () => {
    const summary = { rating: 5, count: 10 };
    axios.get = jest.fn().mockResolvedValue({ data: summary });

    const result = await getAcademyReviewSummary("1");

    expect(result).toEqual(summary);
  });

  it("should return null if request fails", async () => {
    axios.get = jest.fn().mockRejectedValue(null);

    const result = await getAcademyReviewSummary("1");

    expect(result).toBeNull();
  });
});

describe("getCoachReviews", () => {
  it("should return coach reviews", async () => {
    const reviews = [{ id: 1, content: "Great product!" }];
    axios.get = jest.fn().mockResolvedValue({ data: reviews });

    const result = await getCoachReviews("1");

    expect(result).toEqual(reviews);
  });

  it("should return null if request fails", async () => {
    axios.get = jest.fn().mockRejectedValue(null);

    const result = await getCoachReviews("1");

    expect(result).toBeNull();
  });
});
