import axios from "axios";

import {
  getCalendars,
  getMonthlyData,
  getDailyData,
  updateCalendarInfo,
  toggleCalendarDaily,
  toggleCalendarNotification,
  switchCalendarScope
} from "./calendars";

describe("getCalendars", () => {
  it("should return the calendars", async () => {
    const calendars = [{ id: 1, name: "Calendar 1" }];
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

describe("getMonthlyData", () => {
  it("should return the monthly data", async () => {
    const data = [{ id: 1, name: "Calendar 1" }];
    axios.get = jest.fn().mockResolvedValue({ data });

    const result = await getMonthlyData("uuid", "month", "type");

    expect(result).toEqual(data);
  });

  it("should return null if the request fails", async () => {
    axios.get = jest.fn().mockRejectedValue(null);

    const result = await getMonthlyData("uuid", "month", "type");

    expect(result).toBeNull();
  });
});

describe("getDailyData", () => {
  it("should return the daily data", async () => {
    const data = [{ id: 1, name: "Calendar 1" }];
    axios.get = jest.fn().mockResolvedValue({ data });

    const result = await getDailyData("uuid", "date", "type");

    expect(result).toEqual(data);
  });

  it("should return null if the id is not provided", async () => {
    const result = await getDailyData(undefined, "date", "type");

    expect(result).toBeNull();
  });

  it("should return null if the type is not provided", async () => {
    const result = await getDailyData("uuid", "date", undefined);

    expect(result).toBeNull();
  });

  it("should return null if the request fails", async () => {
    axios.get = jest.fn().mockRejectedValue(null);

    const result = await getDailyData("uuid", "date", "type");

    expect(result).toBeNull();
  });
});

describe("updateCalendarInfo", () => {
  it("should return the updated calendar", async () => {
    const calendar = { id: 1, name: "Calendar 1", color: "red" };
    axios.patch = jest.fn().mockResolvedValue({ data: calendar });

    const result = await updateCalendarInfo({
      title: "Calendar 1",
      color: "red",
    });

    expect(result).toEqual(calendar);
  });

  it("should return null if the request fails", async () => {
    axios.patch = jest.fn().mockRejectedValue(null);

    const result = await updateCalendarInfo({
      title: "Calendar 1",
      color: "red",
    });

    expect(result).toBeNull();
  });
});

describe("toggleCalendarNotification", () => {
  it("should return the updated calendar", async () => {
    const calendar = { id: 1, name: "Calendar 1", notifications: true };
    axios.patch = jest.fn().mockResolvedValue({ data: calendar });

    const result = await toggleCalendarNotification({
      type: "type",
      uuid: "uuid",
    });

    expect(result).toEqual(calendar);
  });

  it("should return null if the id is not provided", async () => {
    const result = await toggleCalendarNotification({
      type: "academy",
    });

    expect(result).toBeNull();
  });

  it("should return null if the request fails", async () => {
    axios.patch = jest.fn().mockRejectedValue(null);

    const result = await toggleCalendarNotification({
      type: "type",
      uuid: "uuid",
    });

    expect(result).toBeNull();
  });
});

describe("toggleCalendarDaily", () => {
  it("should return the updated calendar", async () => {
    const calendar = { id: 1, name: "Calendar 1", daily: "12:00" };
    axios.patch = jest.fn().mockResolvedValue({ data: calendar });

    const result = await toggleCalendarDaily({
      type: "type",
      uuid: "uuid",
      time: "09:00",
    });

    expect(result).toEqual(calendar);
  });

  it("should return null if the id is not provided", async () => {
    const result = await toggleCalendarDaily({ type: "academy" });

    expect(result).toBeNull();
  });

  it("should return null if the request fails", async () => {
    axios.patch = jest.fn().mockRejectedValue(null);

    const result = await toggleCalendarDaily({
      type: "type",
      uuid: "uuid",
      time: "09:00",
    });

    expect(result).toBeNull();
  });
});

describe("switchCalendarScope", () => {
  it("should return the updated calendar", async () => {
    const calendar = { id: 1, name: "Calendar 1", scope: "public" };
    axios.patch = jest.fn().mockResolvedValue({ data: calendar });

    const result = await switchCalendarScope("uuid", 1);

    expect(result).toEqual(calendar);
  });

  it("should return null if the request fails", async () => {
    axios.patch = jest.fn().mockRejectedValue(null);

    const result = await switchCalendarScope("uuid", 1);

    expect(result).toBeNull();
  });
});
