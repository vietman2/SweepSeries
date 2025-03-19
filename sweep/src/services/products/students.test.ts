import axios from "axios";

import { getStudents, getAcademyStudentDetail } from "./students";

describe("getStudents", () => {
  it("should return data correctly", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: "data" });

    const result = await getStudents("academyId", "academy", "query");

    expect(result).toBe("data");
  });

  it("should return null if mode is null", async () => {
    const result = await getStudents("academyId", null, "query");

    expect(result).toBeNull();
  });

  it("should return null if an error occurs", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());

    const result = await getStudents("academyId", "academy");

    expect(result).toBeNull();
  });
});

describe("getAcademyStudentDetail", () => {
  it("should return data correctly", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: "data" });

    const result = await getAcademyStudentDetail("academyId", "studentId");

    expect(result).toBe("data");
  });

  it("should return null if an error occurs", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());

    const result = await getAcademyStudentDetail("academyId", "studentId");

    expect(result).toBeNull();
  });
});
