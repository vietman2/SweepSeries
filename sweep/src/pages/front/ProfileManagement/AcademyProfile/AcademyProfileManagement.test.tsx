import { AcademyProfileManagement } from "./AcademyProfileManagement";
import * as AcademyFrontContext from "@contexts/front";
import { sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Academy", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    AcademyProfile: () => <div>AcademyProfile</div>,
    Facilities: () => <div>Facilities</div>,
    Introduction: ({ onRefresh }: { onRefresh: () => void }) => (
      <TouchableOpacity onPress={onRefresh} testID="intro" />
    ),
    WorkingHours: () => <div>WorkingHours</div>,
  };
});

describe("<AcademyProfileManagement />", () => {
  const defaultContext = {
    academy: null,
    programs: [],
    facilityOptions: [],
    loading: false,
    refresh: jest.fn(),
  };

  it("renders correctly", async () => {
    jest.spyOn(AcademyFrontContext, "useAcademyFront").mockReturnValue({
      ...defaultContext,
      academy: sampleAcademyDetail,
    });
    renderWithProviders(<AcademyProfileManagement />);
  });

  it("handles no academy correctly", async () => {
    jest
      .spyOn(AcademyFrontContext, "useAcademyFront")
      .mockReturnValue(defaultContext);
    renderWithProviders(<AcademyProfileManagement />);
  });
});
