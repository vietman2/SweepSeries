import axios from "axios";

import { createLesson } from "./lessons";

describe("createLesson", () => {
  it("should call the API with the correct data", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: {} });

    const response = await createLesson(1, ["1", "2"], new Date(), {
      name: "John Doe",
      phone: "123-456-7890",
    });

    expect(response).toEqual({});
  });

  it("should return null if the API call fails", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(new Error());

    const response = await createLesson(1, ["1", "2"], new Date(), {
      name: "John Doe",
      phone: "123-456-7890",
    });

    expect(response).toBeNull();
  });
});
