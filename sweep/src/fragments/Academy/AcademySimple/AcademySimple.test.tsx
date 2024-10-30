import { AcademySimple } from "./AcademySimple";
import { sampleAcademies } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<AcademySimple />", () => {
  it("renders correctly", () => {
    renderWithProviders(<AcademySimple academy={sampleAcademies[0]} />);
  });

  it("renders with quote", () => {
    renderWithProviders(<AcademySimple academy={sampleAcademies[0]} quote />);
  });
});
