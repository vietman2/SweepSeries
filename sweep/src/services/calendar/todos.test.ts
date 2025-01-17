import axios from "axios";

import { createTodo } from "./todos";

describe("createTodo", () => {
  jest.spyOn(axios, "post").mockResolvedValue({ data: {} });

  it("should return true when the todo is created", async () => {
    const result = await createTodo(1, "title", new Date(), "color");

    expect(result).toBe(true);
  });

  it("should return null when the calendarId is not provided", async () => {
    const result = await createTodo(undefined, "title", new Date(), "color");

    expect(result).toBe(null);
  });

  it("should return null when the date is not provided", async () => {
    const result = await createTodo(1, "title", undefined, "color");

    expect(result).toBe(null);
  });

  it("should return null when the request fails", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(new Error());

    const result = await createTodo(1, "title", new Date(), "color");

    expect(result).toBe(null);
  });
});
