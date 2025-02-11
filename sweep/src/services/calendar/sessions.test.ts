import axios from "axios";

import {
  getSessionDetails,
  updateSessionFeedback,
  updateSessionNotes,
} from "./sessions";

describe("getSessionDetails", () => {
  it("should return the session details", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const sessionDetails = await getSessionDetails("1");

    expect(sessionDetails).toEqual({});
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());

    const sessionDetails = await getSessionDetails("1");

    expect(sessionDetails).toBeNull();
  });
});

describe("updateSessionNotes", () => {
  it("should return true if the notes are updated successfully", async () => {
    jest.spyOn(axios, "patch").mockResolvedValue({});

    const result = await updateSessionNotes("1", "Test notes");

    expect(result).toBe(true);
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(new Error());

    const result = await updateSessionNotes("1", "Test notes");

    expect(result).toBeNull();
  });
});

describe("updateSessionFeedback", () => {
  it("should return true if the feedback is updated successfully", async () => {
    jest.spyOn(axios, "patch").mockResolvedValue({});

    const result = await updateSessionFeedback("1", "Test feedback");

    expect(result).toBe(true);
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(new Error());

    const result = await updateSessionFeedback("1", "Test feedback");

    expect(result).toBeNull();
  });
});
