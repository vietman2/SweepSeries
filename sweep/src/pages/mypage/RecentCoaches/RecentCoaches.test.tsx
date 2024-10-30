import { RecentCoaches } from "./RecentCoaches";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Coach", () => ({
  CoachSimple: () => null,
}));

describe("<RecentCoaches />", () => {
  it("renders correctly", () => {
    renderWithProviders(<RecentCoaches />);
  });
});
