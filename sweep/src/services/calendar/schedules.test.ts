import axios from "axios";

import { createSchedule } from "./schedules";

describe("createSchedule", () => {
  const sampleSchedule = {
    start: new Date(),
    end: new Date(),
    isAllDay: false,
  };
  const sampleAlarm = {
    use: false,
    delta: 0,
    unit: 0,
  };
  const sampleRepeat = {
    use: false,
    period: 0,
    break: "",
  };

  it("should return null when calendarId is not provided", async () => {
    const result = await createSchedule(
      undefined,
      "Test Schedule",
      "This is a test schedule.",
      sampleSchedule,
      sampleAlarm,
      "#000000",
      sampleRepeat
    );

    expect(result).toBeNull();
  });

  it("should return true when the schedule is created successfully", async () => {
    jest.spyOn(axios, "post").mockResolvedValueOnce({ data: {} });

    const result = await createSchedule(
      1,
      "Test Schedule",
      "This is a test schedule.",
      sampleSchedule,
      sampleAlarm,
      "#000000",
      sampleRepeat
    );

    expect(result).toBe(true);
  });

  it("should return null when the schedule creation fails", async () => {
    jest.spyOn(axios, "post").mockRejectedValueOnce(new Error());

    const result = await createSchedule(
      1,
      "Test Schedule",
      "This is a test schedule.",
      sampleSchedule,
      sampleAlarm,
      "#000000",
      sampleRepeat
    );

    expect(result).toBeNull();
  });
});
