import axios from "axios";
import { waitFor } from "@testing-library/react-native";

import { getAgreements } from "./agreements";

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
