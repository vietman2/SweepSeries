import axios from "axios";

import {
  getCalendars,
  getCalendar,
  createCalendar,
  deleteCalendar,
  updateCalendarInfo,
  toggleCalendarDaily,
  toggleCalendarNotification,
} from "./calendars";

describe("getCalendars", () => {
  it("should return the calendars", async () => {
    const calendars = [{ id: "1", name: "Calendar 1" }];
    axios.get = jest.fn().mockResolvedValue({ data: calendars });

    const result = await getCalendars();

    expect(result).toEqual(calendars);
  });

  it("should return null if the request fails", async () => {
    axios.get = jest.fn().mockRejectedValue(null);

    const result = await getCalendars();

    expect(result).toBeNull();
  });
});

describe("getCalendar", () => {
  it("should return the calendar", async () => {
    const calendar = { id: "1", name: "Calendar 1" };
    axios.get = jest.fn().mockResolvedValue({ data: calendar });

    const result = await getCalendar("1");

    expect(result).toEqual(calendar);
  });

  it("should return null if the request fails", async () => {
    axios.get = jest.fn().mockRejectedValue(null);

    const result = await getCalendar("1");

    expect(result).toBeNull();
  });
});

describe("createCalendar", () => {
  it("should return the created calendar", async () => {
    const calendar = { id: "1", name: "Calendar 1" };
    axios.post = jest.fn().mockResolvedValue({ data: calendar });

    const result = await createCalendar();

    expect(result).toEqual(calendar);
  });

  it("should return null if the request fails", async () => {
    axios.post = jest.fn().mockRejectedValue(null);

    const result = await createCalendar();

    expect(result).toBeNull();
  });
});

describe("deleteCalendar", () => {
  it("should return true if the calendar is deleted", async () => {
    axios.delete = jest.fn().mockResolvedValue(null);

    const result = await deleteCalendar("1");

    expect(result).toBe(true);
  });

  it("should return null if the request fails", async () => {
    axios.delete = jest.fn().mockRejectedValue(null);

    const result = await deleteCalendar("1");

    expect(result).toBeNull();
  });
});

describe("updateCalendarInfo", () => {
  it("should return the updated calendar", async () => {
    const calendar = { id: "1", name: "Calendar 1", color: "red" };
    axios.patch = jest.fn().mockResolvedValue({ data: calendar });

    const result = await updateCalendarInfo(1, "Calendar 1", "red");

    expect(result).toEqual(calendar);
  });

  it("should return null if the request fails", async () => {
    axios.patch = jest.fn().mockRejectedValue(null);

    const result = await updateCalendarInfo(1, "Calendar 1", "red");

    expect(result).toBeNull();
  });
});

describe("toggleCalendarNotification", () => {
  it("should return the updated calendar", async () => {
    const calendar = { id: "1", name: "Calendar 1", notifications: true };
    axios.patch = jest.fn().mockResolvedValue({ data: calendar });

    const result = await toggleCalendarNotification("1");

    expect(result).toEqual(calendar);
  });

  it("should return null if the request fails", async () => {
    axios.patch = jest.fn().mockRejectedValue(null);

    const result = await toggleCalendarNotification("1");

    expect(result).toBeNull();
  });
});

describe("toggleCalendarDaily", () => {
  it("should return the updated calendar", async () => {
    const calendar = { id: "1", name: "Calendar 1", daily: "12:00" };
    axios.patch = jest.fn().mockResolvedValue({ data: calendar });

    const result = await toggleCalendarDaily("1", "12:00");

    expect(result).toEqual(calendar);
  });

  it("should return null if the request fails", async () => {
    axios.patch = jest.fn().mockRejectedValue(null);

    const result = await toggleCalendarDaily("1", "12:00");

    expect(result).toBeNull();
  });
});
