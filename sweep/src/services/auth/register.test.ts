import axios from "axios";
import { waitFor } from "@testing-library/react-native";

import { checkUsernameEmail } from "./register";

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
