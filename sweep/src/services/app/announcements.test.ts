import axios from "axios";

import { getAnnouncements } from "./announcements";

describe("getAnnouncements", () => {
  it("should return announcements", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: "announcements" });

    const result = await getAnnouncements();

    expect(result).toBe("announcements");
  });

  it("should return null", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getAnnouncements();

    expect(result).toBe(null);
  });
});
