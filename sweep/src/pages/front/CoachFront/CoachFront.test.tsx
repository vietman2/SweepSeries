import { CoachFront } from "./CoachFront";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./CoachProfile/CoachProfile", () => ({
  CoachProfile: jest.fn(() => null),
}));

describe("<CoachFront />", () => {
  it("should render without crashing", () => {
    renderWithProviders(<CoachFront uuid="uuid" />);
  });
});
