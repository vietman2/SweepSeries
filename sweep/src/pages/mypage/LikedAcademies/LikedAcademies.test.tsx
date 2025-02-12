import { fireEvent, waitFor } from "@testing-library/react-native";

import { LikedAcademies } from "./LikedAcademies";
import * as AcademiesAPI from "@services/products/academy";
import { sampleAcademies } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));
jest.mock("@fragments/Academy", () => ({
  AcademySimple: () => null,
}));

describe("<LikedAcademies />", () => {
  it("renders correctly", async () => {
    jest
      .spyOn(AcademiesAPI, "getLikedAcademies")
      .mockResolvedValue(sampleAcademies);

    const { getByTestId } = renderWithProviders(<LikedAcademies />);

    await waitFor(() => {
      fireEvent.press(getByTestId("refresh"));
      fireEvent.press(getByTestId("academy-1"));
    });
  });

  it("handles api error", async () => {
    jest.spyOn(AcademiesAPI, "getLikedAcademies").mockResolvedValue(null);

    waitFor(() => renderWithProviders(<LikedAcademies />));
  });
});
