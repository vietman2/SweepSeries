import { AcademyDetail } from "./AcademyDetail";
import { renderWithProviders } from "@utils/test-utils";

describe("<AcademyDetail />", () => {
  it("should render the id", () => {
    renderWithProviders(<AcademyDetail />);
  });
});
