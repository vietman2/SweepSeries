import axios from "axios";

import { getPeople, getUsers } from "./members";

describe("getPeople", () => {
  it("should return a list of people if the request is successful", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    await getPeople();
  });

  it("should return null if the request is unsuccessful", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());

    await getPeople();
  });
});

describe("getUsers", () => {
  it("should return a list of users if the request is successful", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    await getUsers();
  });

  it("should return null if the request is unsuccessful", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());

    await getUsers();
  });
});
