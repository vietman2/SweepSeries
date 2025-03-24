import { AcademyInformation } from "./AcademyInformation";
import * as AcademyDetailContext from "@contexts/academy";
import { sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Academy", () => ({
  Introduction: () => "Introduction",
  WorkingHours: () => "WorkingHours",
  Facilities: () => "Facilities",
}));

describe("<AcademyInformation />", () => {
  it("should render correctly", () => {
    jest.spyOn(AcademyDetailContext, "useAcademyDetail").mockReturnValue({
      academy: sampleAcademyDetail,
    });
    renderWithProviders(<AcademyInformation />);
  });

  it("renders nothing if academy is null", () => {
    jest.spyOn(AcademyDetailContext, "useAcademyDetail").mockReturnValue({
      academy: null,
    });
    renderWithProviders(<AcademyInformation />);
  });
});
