import axios from "axios";
import { waitFor } from "@testing-library/react-native";

import { checkUsernameEmail, checkPassword, requestCode, verifyCode, register } from "./register";

describe("checkUsernameEmail", () => {
  it("should successfully check username and email", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({
      status: 200,
      data: "Available",
    });

    const response = await waitFor(() =>
      checkUsernameEmail("username", "email")
    );

    expect(response.status).toBe(200);
  });

  it("should handle username already taken", async () => {
    jest.spyOn(axios, "isAxiosError").mockReturnValueOnce(true);
    jest.spyOn(axios, "get").mockResolvedValue({
      status: 400,
      data: "Username already taken",
    });

    const response = await waitFor(() =>
      checkUsernameEmail("username", "email")
    );

    expect(response.status).toBe(400);
  });

  it("should handle server error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const response = await waitFor(() =>
      checkUsernameEmail("username", "email")
    );

    expect(response.status).toBe(400);
  });
});

describe("checkPassword", () => {
  it("should successfully check password", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({
      status: 200,
      data: "Valid",
    });

    const response = await waitFor(() =>
      checkPassword("password", "password")
    );

    expect(response.status).toBe(200);
  });

  it("should handle invalid password", async () => {
    jest.spyOn(axios, "isAxiosError").mockReturnValueOnce(true);
    jest.spyOn(axios, "post").mockResolvedValue({
      status: 400,
      data: "Invalid password",
    });

    const response = await waitFor(() =>
      checkPassword("password", "password")
    );

    expect(response.status).toBe(400);
  });

  it("should handle server error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const response = await waitFor(() =>
      checkPassword("password", "password")
    );

    expect(response.status).toBe(400);
  });
});

describe("requestCode", () => {
  it("should successfully request code", async () => {
    jest.spyOn(axios, "post").mockResolvedValue(null);

    const response = await waitFor(() => requestCode("phone"));

    expect(response).toBe(true);
  });

  it("should handle server error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const response = await waitFor(() => requestCode("phone"));

    expect(response).toBe(null);
  });
});

describe("verifyCode", () => {
  it("should successfully verify code", async () => {
    jest.spyOn(axios, "post").mockResolvedValue(null);

    const response = await waitFor(() => verifyCode("phone", "code"));

    expect(response.status).toBe(200);
  });

  it("should handle invalid code", async () => {
    jest.spyOn(axios, "isAxiosError").mockReturnValueOnce(true);
    jest.spyOn(axios, "post").mockRejectedValue({
      status: 400,
      data: "Invalid code",
    });

    const response = await waitFor(() => verifyCode("phone", "code"));

    expect(response.status).toBe(400);
  });

  it("should handle server error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const response = await waitFor(() => verifyCode("phone", "code"));

    expect(response.status).toBe(400);
  });
});

describe("register", () => {
  const user_data = {
    username: "username",
    email: "email",
    password: "password",
    password2: "password",
    name: "name",
    phone: "phone",
  };

  const profile_data = {
    gender: "M",
    birthdate: "2000-01-01",
    nickname: "nickname",
    profileImage: "",
  };

  it("should successfully register", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({
      status: 200,
      data: "Registered",
    });

    const response = await waitFor(() =>
      register("catchb", user_data, profile_data, true)
    );

    expect(response).toBe(true);
  });

  it("should handle server error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const response = await waitFor(() =>
      register("catchb", user_data, profile_data, true)
    );

    expect(response).toBe(null);
  });
});
