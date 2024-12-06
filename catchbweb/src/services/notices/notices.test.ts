import axios from "axios";

import { getNotices } from "./notices";

describe("getNotices", () => {
  it("should return data", async () => {
    const data = [{ id: 1, title: "Notice 1" }];
    axios.get = jest.fn().mockResolvedValue({ data });

    const result = await getNotices();

    expect(result).toEqual(data);
  });

  it("should return null when request fails", async () => {
    axios.get = jest.fn().mockRejectedValue(null);

    const result = await getNotices();

    expect(result).toBeNull();
  });
});
