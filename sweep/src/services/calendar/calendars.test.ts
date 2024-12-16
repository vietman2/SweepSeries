import axios from "axios";

import { getCalendars } from "./calendars";

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
