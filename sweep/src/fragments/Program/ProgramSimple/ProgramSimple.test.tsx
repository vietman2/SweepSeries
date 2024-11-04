import { sampleAcademyPrograms } from "@testdata/products";
import { ProgramSimple } from "./ProgramSimple";
import { renderWithProviders } from "@utils/test-utils";

describe("<ProgramSimple />", () => {
  it("renders correctly", () => {
    renderWithProviders(<ProgramSimple program={sampleAcademyPrograms[0]} />);
  });
});
