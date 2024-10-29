import { AcademyCard } from "./AcademyCard";
import { renderWithProviders } from "@utils/test-utils";

describe("<AcademyCard />", () => {
  it("renders correctly", () => {
    renderWithProviders(<AcademyCard />);
  });
});
