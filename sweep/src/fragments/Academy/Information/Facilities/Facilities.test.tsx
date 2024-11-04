import { Facilities } from "./Facilities";
import { sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<Facilities />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <Facilities facilities={sampleAcademyDetail.facilities} type="구비장비" />
    );
  });
});
