import axios from "axios";

import {
  createCoach,
  getCoaches,
  getCoachesByProfile,
  getCoachDetails,
  getMyCoachProfile,
  getEmployedCoaches,
  acceptCoach,
  rejectCoach,
  updateCoachIntro,
  updateCoachSNS,
} from "./coach";

jest.mock("form-data", () => {
  return jest.fn().mockImplementation(() => {
    return {
      append: jest.fn(),
    };
  });
});

describe("getCoaches", () => {
  it("should get coaches", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: "data" });

    const result = await getCoaches("academyId");

    expect(result).toEqual("data");
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getCoaches("academyId");

    expect(result).toBeNull();
  });
});

describe("getCoachDetails", () => {
  it("should get coach details", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: "data" });

    const result = await getCoachDetails("coachId");

    expect(result).toEqual("data");
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getCoachDetails("coachId");

    expect(result).toBeNull();
  });
});

describe("getCoachesByProfile", () => {
  it("should get coaches by profile", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const result = await getCoachesByProfile(1);

    expect(result).toEqual({});
  });

  it("should return null if profileId is not provided", async () => {
    const result = await getCoachesByProfile(undefined);

    expect(result).toBeNull();
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getCoachesByProfile(1);

    expect(result).toBeNull();
  });
});

describe("getMyCoachProfile", () => {
  it("should get my coach profile", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const result = await getMyCoachProfile();

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getMyCoachProfile();

    expect(result).toBeNull();
  });
});

describe("createCoach", () => {
  const file = {
    uri: "uri",
    fileName: "fileName",
    width: 1,
    height: 1,
  };

  it("should create a coach", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: {} });

    const result = await createCoach("career", "academy", file, file, [
      "profession",
    ]);

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await createCoach("career", "academy", file, file, [
      "profession",
    ]);

    expect(result).toBeNull();
  });
});

describe("getEmployedCoaches", () => {
  it("should get employed coaches", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: {} });

    const result = await getEmployedCoaches("academyId");

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const result = await getEmployedCoaches("academyId");

    expect(result).toBeNull();
  });
});

describe("acceptCoach", () => {
  it("should accept a coach", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: {} });

    const result = await acceptCoach("coachId");

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await acceptCoach("coachId");

    expect(result).toBeNull();
  });
});

describe("rejectCoach", () => {
  it("should reject a coach", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ data: {} });

    const result = await rejectCoach("coachId");

    expect(result).toEqual({});
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const result = await rejectCoach("coachId");

    expect(result).toBeNull();
  });
});

describe("updateCoachIntro", () => {
  it("should update a coach's intro", async () => {
    jest.spyOn(axios, "patch").mockResolvedValue({ data: {} });

    const result = await updateCoachIntro("coachId", "intro");

    expect(result).toEqual({});
  });

  it("should return null if uuid is not provided", async () => {
    const result = await updateCoachIntro(undefined, "intro");

    expect(result).toBeNull();
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(null);

    const result = await updateCoachIntro("coachId", "intro");

    expect(result).toBeNull();
  });
});

describe("updateCoachSNS", () => {
  it("should update a coach's SNS", async () => {
    jest.spyOn(axios, "patch").mockResolvedValue({ data: {} });

    const result = await updateCoachSNS("coachId", "insta", "blog");

    expect(result).toEqual({});
  });

  it("should return null if uuid is not provided", async () => {
    const result = await updateCoachSNS(undefined, "insta", "blog");

    expect(result).toBeNull();
  });

  it("should return null on error", async () => {
    jest.spyOn(axios, "patch").mockRejectedValue(null);

    const result = await updateCoachSNS("coachId", "insta", "blog");

    expect(result).toBeNull();
  });
});
