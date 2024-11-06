import { AcademyProfile } from "./AcademyProfile";
import { renderWithProviders } from "@utils/test-utils";

describe("<AcademyProfile />", () => {
  it("renders correctly", () => {
    renderWithProviders(<AcademyProfile />);
  });
  
  it("renders pro mode correctly", () => {
    renderWithProviders(<AcademyProfile pro />);
  });
});
