import axios from "axios";

import { getPeople, getUserDetails, getUsers } from "./members";

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

describe("getUserDetails", () => {
  it("should return a user if the request is successful", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    await getUserDetails("1");
  });

  it("handle undefined parameter", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    await getUserDetails(undefined);
  });

  it("should return null if the request is unsuccessful", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());

    await getUserDetails("1");
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
