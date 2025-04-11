import { fireEvent } from "@testing-library/react-native";

import { AcademyProfileManagement } from "./AcademyProfileManagement";
import * as AcademyFrontContext from "@contexts/front";
import { sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Academy", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    AcademyProfile: ({ onRefresh }: { onRefresh: () => void }) => (
      <TouchableOpacity onPress={onRefresh} testID="refresh-profile" />
    ),
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
    notices: [],
    coaches: [],
    requests: [],
    facilityOptions: [],
    loading: false,
    refresh: jest.fn(),
  };

  it("renders correctly and handles refresh", async () => {
    jest.spyOn(AcademyFrontContext, "useAcademyFront").mockReturnValue({
      ...defaultContext,
      academy: sampleAcademyDetail,
    });

    const { getByTestId } = renderWithProviders(<AcademyProfileManagement />);

    fireEvent.press(getByTestId("refresh-profile"));
  });

  it("handles no academy correctly", async () => {
    jest
      .spyOn(AcademyFrontContext, "useAcademyFront")
      .mockReturnValue(defaultContext);

    renderWithProviders(<AcademyProfileManagement />);
  });
});
