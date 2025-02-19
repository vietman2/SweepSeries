import { CurriculumChip } from "./Curriculum";
import { sampleCurriculums } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<CurriculumChip />", () => {
  it("renders all chips correctly", () => {
    renderWithProviders(
      <>
        <CurriculumChip curriculum={sampleCurriculums[0]} />
        <CurriculumChip curriculum={sampleCurriculums[0]} selected />
        <CurriculumChip curriculum={null} selected />
      </>
    );
  });
});
