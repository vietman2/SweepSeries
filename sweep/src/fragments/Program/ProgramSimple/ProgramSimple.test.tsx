import { ProgramSimple } from "./ProgramSimple";
import { sampleAcademyPrograms } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<ProgramSimple />", () => {
  it("renders all types correctly", () => {
    renderWithProviders(
      <>
        <ProgramSimple program={sampleAcademyPrograms[0]} />
        <ProgramSimple program={sampleAcademyPrograms[0]} type="check" />
        <ProgramSimple
          program={sampleAcademyPrograms[0]}
          type="check"
          color="black"
          selected
        />
      </>
    );
  });
});
