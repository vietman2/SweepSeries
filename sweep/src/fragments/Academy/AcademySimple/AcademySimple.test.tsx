import { AcademySimple } from "./AcademySimple";
import { sampleAcademies } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<AcademySimple />", () => {
  it("should render without crashing", () => {
    renderWithProviders(<AcademySimple academy={sampleAcademies[0]} />);
  });
});
