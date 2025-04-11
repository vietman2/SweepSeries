import axios from "axios";

import {
  getTargets,
  getPositions,
  getPrograms,
  createProgram,
  getProgramsByProfile,
  deleteProgram,
  editProgram,
  getProgramDetail,
  addCoachTeam,
  deleteCoachTeam,
  saveCurriculums,
  toggleCoachSelect,
  getAvailableTimes,
  createLessonRequest,
} from "./programs";
import { sampleCurriculums } from "@testdata/products";

describe("getTargets", () => {
  it("should return the targets", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });
    const result = await getTargets();
    expect(result).toEqual({});
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());
    const result = await getTargets();
    expect(result).toBeNull();
  });
});

describe("getPositions", () => {
  it("should return the positions", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });
    const result = await getPositions();
    expect(result).toEqual({});
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());
    const result = await getPositions();
    expect(result).toBeNull();
  });
});

describe("getPrograms", () => {
  it("should return the programs", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });
    const result = await getPrograms("uuid");
    expect(result).toEqual({});
  });

  it("should return null if the uuid is undefined", async () => {
    const result = await getPrograms(undefined);
    expect(result).toBeNull();
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());
    const result = await getPrograms("uuid");
    expect(result).toBeNull();
  });
});

describe("createProgram", () => {
  it("should create a program", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: {} });
    const result = await createProgram(
      "uuid",
      "name",
      1,
      1,
      [1],
      [{ num_lessons: 1, price: 1 }],
      { select_disabled: false, teams: [] }
    );
    expect(result).toEqual({});
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(new Error());
    const result = await createProgram(
      "uuid",
      "name",
      1,
      1,
      [1],
      [{ num_lessons: 1, price: 1 }],
      { select_disabled: false, teams: [] }
    );
    expect(result).toBeNull();
  });
});

describe("getProgramsByProfile", () => {
  it("should return the programs", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });
    const result = await getProgramsByProfile(1);
    expect(result).toEqual({});
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());
    const result = await getProgramsByProfile(1);
    expect(result).toBeNull();
  });

  it("should return null if the profile is undefined", async () => {
    const result = await getProgramsByProfile(undefined);
    expect(result).toBeNull();
  });
});

describe("deleteProgram", () => {
  it("should delete the program", async () => {
    jest.spyOn(axios, "delete").mockResolvedValue({ data: {} });
    const result = await deleteProgram(1);
    expect(result).toEqual({});
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "delete").mockRejectedValue(new Error());
    const result = await deleteProgram(1);
    expect(result).toBeNull();
  });

  it("should return null if the program is undefined", async () => {
    const result = await deleteProgram(undefined);
    expect(result).toBeNull();
  });
});

describe("editProgram", () => {
  it("should edit the program", async () => {
    jest.spyOn(axios, "patch").mockResolvedValue({ data: {} });
    const result = await editProgram(1, "name", 1, 1, [1]);
    expect(result).toEqual({});
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(new Error());
    const result = await editProgram(1, "name", 1, 1, [1]);
    expect(result).toBeNull();
  });

  it("should return null if the program is undefined", async () => {
    const result = await editProgram(undefined, "name", 1, 1, [1]);
    expect(result).toBeNull();
  });
});

describe("getProgramDetail", () => {
  it("should return the program detail", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });
    const result = await getProgramDetail("1");
    expect(result).toEqual({});
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());
    const result = await getProgramDetail("1");
    expect(result).toBeNull();
  });
});

describe("addCoachTeam", () => {
  it("should add a coach to the team", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: {} });
    const result = await addCoachTeam(1, ["1"]);
    expect(result).toEqual({});
  });

  it("should return null if programid is undefined", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: {} });
    const result = await addCoachTeam(undefined, ["1"]);
    expect(result).toEqual(null);
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(new Error());
    const result = await addCoachTeam(1, ["1"]);
    expect(result).toBeNull();
  });
});

describe("deleteCoachTeam", () => {
  it("should delete a coach from the team", async () => {
    jest.spyOn(axios, "delete").mockResolvedValue({ data: {} });
    const result = await deleteCoachTeam(1, 1);
    expect(result).toEqual({});
  });

  it("should return null if the programid is undefined", async () => {
    jest.spyOn(axios, "delete").mockRejectedValue(new Error());
    const result = await deleteCoachTeam(undefined, 1);
    expect(result).toBeNull();
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "delete").mockRejectedValue(new Error());
    const result = await deleteCoachTeam(1, 1);
    expect(result).toBeNull();
  });
});

describe("saveCurriculums", () => {
  it("should save the curriculums", async () => {
    jest.spyOn(axios, "patch").mockResolvedValue({ data: {} });
    const result = await saveCurriculums(1, sampleCurriculums);
    expect(result).toEqual({});
  });

  it("should return null if programid is undefined", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(new Error());
    const result = await saveCurriculums(undefined, sampleCurriculums);
    expect(result).toBeNull();
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(new Error());
    const result = await saveCurriculums(1, sampleCurriculums);
    expect(result).toBeNull();
  });
});

describe("toggleCoachSelect", () => {
  it("should toggle the coach select", async () => {
    jest.spyOn(axios, "patch").mockResolvedValue({ data: {} });
    const result = await toggleCoachSelect(1);
    expect(result).toEqual({});
  });

  it("should return null if programid is undefined", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(new Error());
    const result = await toggleCoachSelect(undefined);
    expect(result).toBeNull();
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(new Error());
    const result = await toggleCoachSelect(1);
    expect(result).toBeNull();
  });
});

describe("getAvailableTimes", () => {
  it("should return the available times", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });
    const result = await getAvailableTimes(1, 1, "date");
    expect(result).toEqual({});
  });

  it("should return null if programid is undefined", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());
    const result = await getAvailableTimes(undefined, 1, "date");
    expect(result).toBeNull();
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error());
    const result = await getAvailableTimes(1, 1, "date");
    expect(result).toBeNull();
  });
});

describe("createLessonRequest", () => {
  it("should create a lesson request", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: {} });
    const result = await createLessonRequest(1, 1, new Date(), 1);
    expect(result).toEqual({});
  });

  it("should return null if programid is undefined", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: {} });
    const result = await createLessonRequest(undefined, 1, new Date(), 1);
    expect(result).toBeNull();
  });

  it("should return null if the request fails", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(new Error());
    const result = await createLessonRequest(1, 1, new Date(), 1);
    expect(result).toBeNull();
  });
});
