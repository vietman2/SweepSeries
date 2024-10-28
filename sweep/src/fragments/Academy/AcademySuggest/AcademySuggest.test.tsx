import { AcademySuggest } from "./AcademySuggest";
import { sampleAcademies } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<AcademySuggest />", () => {
  it("renders correctly", () => {
    renderWithProviders(<AcademySuggest academy={sampleAcademies[0]} />);
  });
});
