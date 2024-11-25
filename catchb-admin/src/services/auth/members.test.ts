import axios from "axios";

import { getUsers } from "./members";

describe("getUsers", () => {
  it("should return a list of users if the request is successful", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    await getUsers();
  });

  it("handles request with role query", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    await getUsers("query");
  });

  it("should return null if the request is unsuccessful", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());

    await getUsers();
  });
});
