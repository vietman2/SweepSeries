import { LikedCoaches } from "./LikedCoaches";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Coach", () => ({
  CoachSimple: () => null,
}));

describe("<LikedCoaches />", () => {
  it("renders correctly", () => {
    renderWithProviders(<LikedCoaches />);
  });
});
