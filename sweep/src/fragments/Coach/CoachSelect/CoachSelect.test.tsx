import { CoachSelect } from "./CoachSelect";
import { sampleCoaches } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<CoachSelect />", () => {
  it("renders correctly", () => {
    renderWithProviders(<CoachSelect coach={sampleCoaches[0]} />);
  });

  it("renders correctly with props", () => {
    renderWithProviders(<CoachSelect coach={sampleCoaches[0]} selected />);
  });
});
