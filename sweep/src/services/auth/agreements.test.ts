import axios from "axios";
import { waitFor } from "@testing-library/react-native";

import { getAgreements, getAgreementContent } from "./agreements";

describe("getAgreements", () => {
  it("should successfully get agreements", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({
      status: 200,
      data: "Agreements",
    });

    const response = await waitFor(() => getAgreements());

    expect(response).toBe("Agreements");
  });

  it("should handle server error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const response = await waitFor(() => getAgreements());

    expect(response).toBe(null);
  });
});

describe("getAgreementContent", () => {
  it("should successfully get agreement content", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({
      status: 200,
      data: "Agreement Content",
    });

    const response = await waitFor(() => getAgreementContent("1"));

    expect(response).toBe("Agreement Content");
  });

  it("should handle server error", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(null);

    const response = await waitFor(() => getAgreementContent("1"));

    expect(response).toBe(null);
  });
});
