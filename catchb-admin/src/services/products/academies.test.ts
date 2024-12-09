import axios from "axios";

import { getAcademies, approveAcademy, rejectAcademy } from "./academies";

describe("getAcademies", () => {
  it("should return the data when the request is successful", async () => {
    const data = [{ id: "1", name: "Academy 1" }];
    const response = { data };

    jest.spyOn(axios, "get").mockResolvedValue(response);

    const result = await getAcademies("pending");

    expect(result).toEqual(data);
  });

  it("should return null when the request fails", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getAcademies("pending");

    expect(result).toBeNull();
  });
});

describe("approveAcademy", () => {
  it("should return the data when the request is successful", async () => {
    const data = { id: "1", name: "Academy 1" };
    const response = { data };

    jest.spyOn(axios, "post").mockResolvedValue(response);

    const result = await approveAcademy("1");

    expect(result).toEqual(data);
  });

  it("should return null when the request fails", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await approveAcademy("1");

    expect(result).toBeNull();
  });
});

describe("rejectAcademy", () => {
  it("should return the data when the request is successful", async () => {
    const data = { id: "1", name: "Academy 1" };
    const response = { data };

    jest.spyOn(axios, "post").mockResolvedValue(response);

    const result = await rejectAcademy("1", "Reason");

    expect(result).toEqual(data);
  });

  it("should return null when the request fails", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await rejectAcademy("1", "Reason");

    expect(result).toBeNull();
  });
});
