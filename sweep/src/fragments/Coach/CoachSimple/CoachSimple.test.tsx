import { CoachSimple } from "./CoachSimple";
import { sampleCoaches } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<CoachSimple />", () => {
  it("renders correctly: unliked coach", () => {
    renderWithProviders(<CoachSimple coach={sampleCoaches[0]} />);
  });

  it("renders correctly: liked coach", () => {
    renderWithProviders(<CoachSimple coach={sampleCoaches[1]} />);
  });
});
