import axios from "axios";

import { updateProfile, uploadProfileImage } from "./profiles";

jest.mock("form-data", () => {
  return jest.fn().mockImplementation(() => {
    return {
      append: jest.fn(),
    };
  });
});

describe("updateProfile", () => {
  it("should return null if id is undefined", async () => {
    const result = await updateProfile(
      undefined,
      "nickname",
      "2022-01-01",
      "introduction"
    );

    expect(result).toBeNull();
  });

  it("should return data if request is successful", async () => {
    const response = { data: "data" };
    axios.patch = jest.fn().mockResolvedValue(response);

    const result = await updateProfile(
      1,
      "nickname",
      "2022-01-01",
      "introduction"
    );

    expect(result).toBe(response.data);
  });

  it("should return null if request fails", async () => {
    axios.patch = jest.fn().mockRejectedValue(null);

    const result = await updateProfile(
      1,
      "nickname",
      "2022-01-01",
      "introduction"
    );

    expect(result).toBeNull();
  });
});

describe("uploadProfileImage", () => {
  const mockFile = {
    uri: "uri",
    fileName: "fileName",
    width: 1,
    height: 1,
  };

  it("should return null if id is undefined", async () => {
    const result = await uploadProfileImage(undefined, mockFile);

    expect(result).toBeNull();
  });

  it("should return data if request is successful", async () => {
    const response = { data: "data" };
    axios.patch = jest.fn().mockResolvedValue(response);

    const result = await uploadProfileImage(1, mockFile);

    expect(result).toBe(response.data);
  });

  it("should return null if request fails", async () => {
    axios.patch = jest.fn().mockRejectedValue(null);

    const result = await uploadProfileImage(1, mockFile);

    expect(result).toBeNull();
  });
});
