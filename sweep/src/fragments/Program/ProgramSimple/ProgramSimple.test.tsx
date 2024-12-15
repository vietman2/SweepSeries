import { ProgramSimple } from "./ProgramSimple";
import { sampleAcademyPrograms } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<ProgramSimple />", () => {
  it("renders correctly", () => {
    renderWithProviders(<ProgramSimple program={sampleAcademyPrograms[0]} />);
  });
});
