import axios from "axios";

import { createTodo, toggleTodoStatus } from "./todos";

describe("createTodo", () => {
  jest.spyOn(axios, "post").mockResolvedValue({ data: {} });

  it("should return true when the todo is created", async () => {
    const result = await createTodo("title", new Date(), "color");

    expect(result).toBe(true);
  });

  it("should return null when the date is not provided", async () => {
    const result = await createTodo("title", undefined, "color");

    expect(result).toBe(null);
  });

  it("should return null when the request fails", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(new Error());

    const result = await createTodo("title", new Date(), "color");

    expect(result).toBe(null);
  });
});

describe("toggleTodoStatus", () => {
  jest.spyOn(axios, "patch").mockResolvedValue({ data: {} });

  it("should return true when the todo status is toggled", async () => {
    const result = await toggleTodoStatus(1);

    expect(result).toBe(true);
  });

  it("should return null when the request fails", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(new Error());

    const result = await toggleTodoStatus(1);

    expect(result).toBe(null);
  });
});
