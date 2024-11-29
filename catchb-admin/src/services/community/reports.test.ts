import axios from "axios";

import {
  getPostReports,
  getPostReportDetails,
  updatePostReport,
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
