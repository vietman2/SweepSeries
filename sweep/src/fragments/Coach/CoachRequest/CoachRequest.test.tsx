import { CoachRequest } from "./CoachRequest";
import { sampleCoachRequests } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<CoachRequest />", () => {
  it("should render without crashing", () => {
    renderWithProviders(<CoachRequest coach={sampleCoachRequests[0]} />);
  });
});
