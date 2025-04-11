import axios from "axios";

import {
  createAcademy,
  getAcademies,
  getRecommendations,
  getLikedAcademies,
  likeAcademy,
  getAcademyDetail,
  getMyAcademies,
  getFacilityOptions,
  updateAcademyIntroduction,
  updateFacilities,
  updateBusinessHours,
  updateLogo,
  uploadImage,
  deleteImage,
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

describe("getRecommendations", () => {
  it("should get recommendations", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const result = await getRecommendations();

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getRecommendations();

    expect(result).toBeNull();
  });
});

describe("getLikedAcademies", () => {
  it("should get liked academies", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const result = await getLikedAcademies();

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getLikedAcademies();

    expect(result).toBeNull();
  });
});

describe("likeAcademy", () => {
  it("should like an academy", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: {} });

    const result = await likeAcademy("uuid");

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await likeAcademy("uuid");

    expect(result).toBeNull();
  });
});

describe("getAcademyDetail", () => {
  it("should get academy detail", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const result = await getAcademyDetail("uuid");

    expect(result).toEqual({});
  });

  it("should return null if uuid is undefined", async () => {
    const result = await getAcademyDetail(undefined);

    expect(result).toBeNull();
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

    const result = await getMyAcademies("student");

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getMyAcademies("student");

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

describe("updateBusinessHours", () => {
  const dailyScheduleData = {
    open_time: "09:00",
    close_time: "18:00",
    is_closed: false,
    is_allday: false,
  };
  const data = [
    dailyScheduleData,
    dailyScheduleData,
    dailyScheduleData,
    dailyScheduleData,
    dailyScheduleData,
    dailyScheduleData,
    dailyScheduleData,
  ];
  it("should update business hours (all types)", async () => {
    jest.spyOn(axios, "patch").mockResolvedValue({ data: {} });

    const result = await updateBusinessHours("uuid", data, true, true, true);

    expect(result).toEqual({});

    await updateBusinessHours("uuid", data, false, true, true);
    await updateBusinessHours("uuid", data, false, true, false);
    await updateBusinessHours("uuid", data, false, false, true);
    await updateBusinessHours("uuid", data, false, false, false);
  });

  it("handles fail", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(null);

    const result = await updateBusinessHours("uuid", data, true, true, true);

    expect(result).toEqual(null);
  });
});

describe("updateLogo", () => {
  const file = {
    uri: "uri",
    fileName: "fileName",
    width: 1,
    height: 1,
  };

  it("should update logo", async () => {
    jest.spyOn(axios, "patch").mockResolvedValue({ data: {} });

    const result = await updateLogo("uuid", file);

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(null);

    const result = await updateLogo("uuid", file);

    expect(result).toBeNull();
  });
});

describe("uploadImage", () => {
  const file = {
    uri: "uri",
    fileName: "fileName",
    width: 1,
    height: 1,
  };

  it("should upload image", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: {} });

    const result = await uploadImage("uuid", [file]);

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await uploadImage("uuid", [file]);

    expect(result).toBeNull();
  });
});

describe("deleteImage", () => {
  it("should delete image", async () => {
    jest.spyOn(axios, "delete").mockResolvedValue({});

    const result = await deleteImage("uuid", 1);

    expect(result).toBe(true);
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "delete").mockRejectedValue(null);

    const result = await deleteImage("uuid", 1);

    expect(result).toBeNull();
  });
});
