import { CoachDetail } from "./CoachDetail";
import { renderWithProviders } from "@utils/test-utils";

describe("<CoachDetail />", () => {
  it("renders correctly", () => {
    renderWithProviders(<CoachDetail />);
  });
});
