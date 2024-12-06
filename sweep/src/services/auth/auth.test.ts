import axios from "axios";

import { login, logout, refresh, kakaoLogin, naverLogin } from "./auth";
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

describe("kakaoLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return response data on success", async () => {
    const response = { data: { access: "access", refresh: "refresh" } };
    jest.spyOn(axios, "post").mockResolvedValue(response);

    const result = await kakaoLogin();

    expect(result).toEqual(response.data);
  });

  it("should return null on failure", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await kakaoLogin();

    expect(result).toBeNull();
  });
});

describe("naverLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const data = {
    response: {
      id: "id",
      email: "email",
      name: "name",
      mobile: "mobile",
      birthday: "birthday",
      birthyear: 2000,
      gender: "M",
      nickname: "nickname",
      profile_image: "profile_image",
      age: null,
      mobile_e164: "mobile_e164",
    },
    resultcode: "00",
    message: "message",
  };

  it("should return response data on success", async () => {
    const response = { data: { access: "access", refresh: "refresh" } };
    jest.spyOn(axios, "post").mockResolvedValue(response);

    const result = await naverLogin(data);

    expect(result).toEqual(response.data);
  });

  it("should return null on failure", async () => {
    jest
      .spyOn(axios, "post")
      .mockRejectedValue({ response: { data: "error" } });

    const result = await naverLogin({
      response: {
        id: "id",
        email: "email",
        name: "name",
        mobile: "mobile",
        birthday: null,
        birthyear: null,
        gender: null,
        nickname: null,
        profile_image: null,
        age: null,
        mobile_e164: "mobile_e164",
      },
      resultcode: "00",
      message: "message",
    });

    expect(result).toBeNull();
  });
});
