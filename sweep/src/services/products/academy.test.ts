import axios from "axios";

import {
  createAcademy,
  getAcademies,
  getAcademyDetail,
  getMyAcademies,
  getFacilityOptions,
  updateAcademyIntroduction,
  updateFacilities,
} from "./academy";

jest.mock("form-data", () => {
  return jest.fn().mockImplementation(() => {
    return {
      append: jest.fn(),
    };
  });
});

describe("createAcademy", () => {
  const file = {
    uri: "uri",
    fileName: "fileName",
    width: 1,
    height: 1,
  };

  it("should create an academy", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: {} });

    const result = await createAcademy("name", "phone", "regCode", file, file, {
      road_address_part1: "road_address_part1",
      road_address_part2: "road_address_part2",
      building_name: "building_name",
      zip_code: "zip_code",
      bcode: "bcode",
    });

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await createAcademy("name", "phone", "regCode", file, file, {
      road_address_part1: "road_address_part1",
      road_address_part2: "road_address_part2",
      building_name: "building_name",
      zip_code: "zip_code",
      bcode: "bcode",
    });

    expect(result).toBeNull();
  });
});

describe("getAcademies", () => {
  it("should get academies", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const result = await getAcademies("query");

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getAcademies("query");

    expect(result).toBeNull();
  });
});

describe("getAcademyDetail", () => {
  it("should get academy detail", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const result = await getAcademyDetail("uuid");

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getAcademyDetail("uuid");

    expect(result).toBeNull();
  });
});

describe("getMyAcademies", () => {
  it("should get my academies", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const result = await getMyAcademies();

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getMyAcademies();

    expect(result).toBeNull();
  });
});

describe("updateAcademyIntroduction", () => {
  it("should update academy introduction", async () => {
    jest.spyOn(axios, "patch").mockResolvedValue({ data: {} });

    const result = await updateAcademyIntroduction("uuid", "introduction");

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(null);

    const result = await updateAcademyIntroduction("uuid", "introduction");

    expect(result).toBeNull();
  });
});

describe("getFacilityOptions", () => {
  it("should get facility options", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const result = await getFacilityOptions();

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getFacilityOptions();

    expect(result).toBeNull();
  });
});

describe("updateFacilities", () => {
  it("should update facilities", async () => {
    jest.spyOn(axios, "patch").mockResolvedValue({ data: {} });

    const result = await updateFacilities("uuid", []);

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(null);

    const result = await updateFacilities("uuid", []);

    expect(result).toBeNull();
  });
});
