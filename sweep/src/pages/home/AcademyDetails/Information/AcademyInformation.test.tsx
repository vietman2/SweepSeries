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
  const defaultContext = {
    academy: sampleAcademyDetail,
    programs: [],
    coaches: [],
    notices: [],
    summary: undefined,
    reviews: [],
    result: undefined,
    loading: false,
    error: false,
    showDetailPage: false,
    selectCoach: jest.fn(),
    selectNotice: jest.fn(),
    refresh: jest.fn(),
  };

  it("should render correctly", () => {
    jest
      .spyOn(AcademyDetailContext, "useAcademyDetail")
      .mockReturnValue(defaultContext);
    renderWithProviders(<AcademyInformation />);
  });

  it("renders nothing if academy is null", () => {
    jest.spyOn(AcademyDetailContext, "useAcademyDetail").mockReturnValue({
      ...defaultContext,
      academy: null,
    });
    renderWithProviders(<AcademyInformation />);
  });
});
