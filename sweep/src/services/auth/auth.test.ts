import axios from "axios";

import {
  login,
  logout,
  refresh,
  socialLogin,
  getProfile,
} from "./auth";
import * as StorageAPI from "@services/storage/secure";

describe("login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return response data on success", async () => {
    const response = { data: { access: "access", refresh: "refresh" } };
    jest.spyOn(axios, "post").mockResolvedValue(response);
    jest.spyOn(StorageAPI, "saveSecure").mockResolvedValue();

    const result = await login("username", "pw");

    expect(result).toEqual(response.data);
  });

  it("should return null on failure", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await login("username", "pw");

    expect(result).toBeNull();
  });
});

describe("logout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return true on success", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({});

    const result = await logout();

    expect(result).toBe(true);
  });

  it("should return false on failure", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await logout();

    expect(result).toBe(null);
  });
});

describe("refresh", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return response data on success", async () => {
    const response = { data: { access: "access" } };
    jest.spyOn(axios, "post").mockResolvedValue(response);
    jest.spyOn(StorageAPI, "getSecure").mockResolvedValue("refresh");

    const result = await refresh();

    expect(result).toEqual(response.data);
  });

  it("should return null on failure", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await refresh();

    expect(result).toBeNull();
  });
});

describe("socialLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return response data on success", async () => {
    const response = { data: { access: "access", refresh: "refresh" } };
    jest.spyOn(axios, "post").mockResolvedValue(response);

    const result = await socialLogin(1);

    expect(result).toEqual(response.data);
  });

  it("should return REDIRECT on not_registered", async () => {
    const response = { data: { result: "not_registered" } };
    jest.spyOn(axios, "post").mockResolvedValue(response);

    const result = await socialLogin(1);

    expect(result).toBe("REDIRECT");
  });

  it("should return null on failure", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await socialLogin("1");

    expect(result).toBeNull();
  });
});

describe("getProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return response data on success", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const result = await getProfile("token");

    expect(result).toEqual({});
  });

  it("should return null on failure", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getProfile("token");

    expect(result).toBeNull();
  });
});
