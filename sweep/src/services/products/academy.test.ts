import axios from "axios";

import { createAcademy } from "./academy";

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
