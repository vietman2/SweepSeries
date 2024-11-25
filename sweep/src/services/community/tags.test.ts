import axios from "axios";

import { getTags } from "./tags";

describe("getTags", () => {
  it("should return tags", async () => {
    const tags = [
      { id: 1, name: "tag1" },
      { id: 2, name: "tag2" },
    ];

    jest.spyOn(axios, "get").mockResolvedValue({ data: tags });

    const response = await getTags("forum");

    expect(response).toEqual(tags);
  });

  it("should return null when an error occurs", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());

    const response = await getTags("forum");

    expect(response).toBeNull();
  });
});
