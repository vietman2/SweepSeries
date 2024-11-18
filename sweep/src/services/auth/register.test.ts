import axios from "axios";
import { waitFor } from "@testing-library/react-native";

import { checkUsernameEmail, checkPassword } from "./register";

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
