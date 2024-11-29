import axios from "axios";

import {
  getPostReports,
  getPostReportDetails,
  updatePostReport,
  getCommentReports,
  getCommentReportDetails,
  updateCommentReport,
  getReCommentReports,
  getReCommentReportDetails,
  updateReCommentReport,
} from "./reports";

describe("getPostReports", () => {
  it("should return an array of post reports if the request is successful", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: [] });

    const response = await getPostReports();

    expect(response).toEqual([]);
  });

  it("should return null if the request is unsuccessful", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());

    const response = await getPostReports();

    expect(response).toBeNull();
  });
});

describe("getPostReportDetails", () => {
  it("should return a post report object if the request is successful", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const response = await getPostReportDetails("1");

    expect(response).toEqual({});
  });

  it("should return null if reportId is undefined", async () => {
    const response = await getPostReportDetails(undefined);

    expect(response).toBeNull();
  });

  it("should return null if the request is unsuccessful", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());

    const response = await getPostReportDetails("1");

    expect(response).toBeNull();
  });
});

describe("updatePostReport", () => {
  it("should return true if the request is successful", async () => {
    jest.spyOn(axios, "patch").mockResolvedValue({ data: {} });

    const response = await updatePostReport("1", true, "feedback");

    expect(response).toBeTruthy();
  });

  it("should return null if reportId is undefined", async () => {
    const response = await updatePostReport(undefined, true, "feedback");

    expect(response).toBeNull();
  });

  it("should return null if the request is unsuccessful", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(new Error());

    const response = await updatePostReport("1", true, "feedback");

    expect(response).toBeNull();
  });
});

describe("getCommentReports", () => {
  it("should return an array of comment reports if the request is successful", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: [] });

    const response = await getCommentReports();

    expect(response).toEqual([]);
  });

  it("should return null if the request is unsuccessful", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());

    const response = await getCommentReports();

    expect(response).toBeNull();
  });
});

describe("getCommentReportDetails", () => {
  it("should return a comment report object if the request is successful", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const response = await getCommentReportDetails("1");

    expect(response).toEqual({});
  });

  it("should return null if reportId is undefined", async () => {
    const response = await getCommentReportDetails(undefined);

    expect(response).toBeNull();
  });

  it("should return null if the request is unsuccessful", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());

    const response = await getCommentReportDetails("1");

    expect(response).toBeNull();
  });
});

describe("updateCommentReport", () => {
  it("should return true if the request is successful", async () => {
    jest.spyOn(axios, "patch").mockResolvedValue({ data: {} });

    const response = await updateCommentReport("1", true, "feedback");

    expect(response).toBeTruthy();
  });

  it("should return null if reportId is undefined", async () => {
    const response = await updateCommentReport(undefined, true, "feedback");

    expect(response).toBeNull();
  });

  it("should return null if the request is unsuccessful", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(new Error());

    const response = await updateCommentReport("1", true, "feedback");

    expect(response).toBeNull();
  });
});

describe("getReCommentReports", () => {
  it("should return an array of recomment reports if the request is successful", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: [] });

    const response = await getReCommentReports();

    expect(response).toEqual([]);
  });

  it("should return null if the request is unsuccessful", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());

    const response = await getReCommentReports();

    expect(response).toBeNull();
  });
});

describe("getReCommentReportDetails", () => {
  it("should return a recomment report object if the request is successful", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const response = await getReCommentReportDetails("1");

    expect(response).toEqual({});
  });

  it("should return null if reportId is undefined", async () => {
    const response = await getReCommentReportDetails(undefined);

    expect(response).toBeNull();
  });

  it("should return null if the request is unsuccessful", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());

    const response = await getReCommentReportDetails("1");

    expect(response).toBeNull();
  });
});

describe("updateReCommentReport", () => {
  it("should return true if the request is successful", async () => {
    jest.spyOn(axios, "patch").mockResolvedValue({ data: {} });

    const response = await updateReCommentReport("1", true, "feedback");

    expect(response).toBeTruthy();
  });

  it("should return null if reportId is undefined", async () => {
    const response = await updateReCommentReport(undefined, true, "feedback");

    expect(response).toBeNull();
  });

  it("should return null if the request is unsuccessful", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(new Error());

    const response = await updateReCommentReport("1", true, "feedback");

    expect(response).toBeNull();
  });
});
