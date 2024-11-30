import axios from "axios";

import { createTerms, deleteTerm, updateTerm, getTerms, getTerm } from "./terms";

describe("createTerms", () => {
  it("should successfully create terms", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({
      status: 200,
    });

    const response = await createTerms("Title", "Content", true);

    expect(response).toBe(true);
  });

  it("should handle server error", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(null);

    const response = await createTerms("Title", "Content", true);

    expect(response).toBe(null);
  });

  it("should handle undefined content", async () => {
    const response = await createTerms("Title", undefined, true);

    expect(response).toBe(null);
  });
});

describe("getTerms", () => {
  it("should successfully get terms", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({
      status: 200,
      data: "Terms",
    });

    const response = await getTerms();

    expect(response).toBe("Terms");
  });

  it("should handle server error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const response = await getTerms();

    expect(response).toBe(null);
  });
});

describe("getTerm", () => {
  it("should successfully get term", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({
      status: 200,
      data: "Term",
    });

    const response = await getTerm("1");

    expect(response).toBe("Term");
  });

  it("should handle server error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const response = await getTerm("1");

    expect(response).toBe(null);
  });

  it("should handle undefined id", async () => {
    const response = await getTerm(undefined);

    expect(response).toBe(null);
  });
});

describe("deleteTerm", () => {
  it("should successfully delete term", async () => {
    jest.spyOn(axios, "delete").mockResolvedValue({
      status: 200,
    });

    const response = await deleteTerm("1");

    expect(response).toBe(true);
  });

  it("should handle server error", async () => {
    jest.spyOn(axios, "delete").mockRejectedValue(null);

    const response = await deleteTerm("1");

    expect(response).toBe(null);
  });

  it("should handle undefined id", async () => {
    const response = await deleteTerm(undefined);

    expect(response).toBe(null);
  });
});

describe("updateTerm", () => {
  it("should successfully update term", async () => {
    jest.spyOn(axios, "put").mockResolvedValue({
      status: 200,
    });

    const response = await updateTerm("1", "Content", "Summary");

    expect(response).toBe(true);
  });

  it("should handle server error", async () => {
    jest.spyOn(axios, "put").mockRejectedValue(null);

    const response = await updateTerm("1", "Content", "Summary");

    expect(response).toBe(null);
  });

  it("should handle undefined id", async () => {
    const response = await updateTerm(undefined, "Content", "Summary");

    expect(response).toBe(null);
  });
});
