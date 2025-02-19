import axios from "axios";

import { createLesson, getCurriculum } from "./lessons";

describe("createLesson", () => {
  const mockStudent = {
    id: 1,
    name: "John Doe",
    phone: "123-456-7890",
  };

  const mockCurriculum = {
    id: 1,
    num_lessons: 10,
    price: 100,
  };

  it("should call the API with the correct data", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: {} });

    const response = await createLesson(
      1,
      ["1", "2"],
      new Date(),
      mockStudent,
      mockCurriculum
    );

    expect(response).toEqual({});
  });

  it("should return null if the API call fails", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(new Error());

    const response = await createLesson(
      1,
      ["1", "2"],
      new Date(),
      mockStudent,
      mockCurriculum
    );

    expect(response).toBeNull();
  });
});

describe("getCurriculum", () => {
  it("should call the API with the correct data", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const response = await getCurriculum(1, 1);

    expect(response).toEqual({});
  });

  it("should return null if the API call fails", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());

    const response = await getCurriculum(1, 1);

    expect(response).toBeNull();
  });
});
