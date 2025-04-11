import axios from "axios";

import {
  getSessions,
  getSessionDetails,
  getSessionAvailableTimes,
  updateSessionFeedback,
  updateSessionNotes,
  requestSessionScheduleChange,
} from "./sessions";

describe("getSessions", () => {
  it("should return the sessions", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const sessions = await getSessions("2021-01");

    expect(sessions).toEqual({});
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());

    const sessions = await getSessions("2021-01");

    expect(sessions).toBeNull();
  });
});

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

describe("getSessionAvailableTimes", () => {
  it("should return the available times", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: { times: [] } });

    const availableTimes = await getSessionAvailableTimes("1", "2021-01-01");

    expect(availableTimes).toEqual({ times: [] });
  });

  it("should return null if the date is empty", async () => {
    const availableTimes = await getSessionAvailableTimes("1", "");

    expect(availableTimes).toBeNull();
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());

    const availableTimes = await getSessionAvailableTimes("1", "2021-01-01");

    expect(availableTimes).toBeNull();
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

describe("requestSessionScheduleChange", () => {
  it("should return true if the schedule change is requested successfully", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({data: "result"});

    const result = await requestSessionScheduleChange("1", "2021-01-01", "10:00");

    expect(result).toBe("result");
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(new Error());

    const result = await requestSessionScheduleChange("1", "2021-01-01", "10:00");

    expect(result).toBeNull();
  });
});
