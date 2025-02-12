import { fireEvent, waitFor } from "@testing-library/react-native";

import { LikedCoaches } from "./LikedCoaches";
import * as CoachesAPI from "@services/products/coach";
import { sampleCoaches } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));
jest.mock("@fragments/Coach", () => ({
  CoachSimple: () => null,
}));

describe("<LikedCoaches />", () => {
  it("handles redirect and refresh correctly", async () => {
    jest.spyOn(CoachesAPI, "getLikedCoaches").mockResolvedValue(sampleCoaches);

    const { getByTestId } = renderWithProviders(<LikedCoaches />);

    await waitFor(() => {
      fireEvent.press(getByTestId("refresh"));
      fireEvent.press(getByTestId("coach-1"));
    });
  });

  it("handles api error", async () => {
    jest.spyOn(CoachesAPI, "getLikedCoaches").mockResolvedValue(null);

    waitFor(() => renderWithProviders(<LikedCoaches />));
  });
});
