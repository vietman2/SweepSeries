import { WorkingHours } from "./WorkingHours";
import { sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<WorkingHours />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <WorkingHours workingHours={sampleAcademyDetail.working_hours} />
    );
  });
});
