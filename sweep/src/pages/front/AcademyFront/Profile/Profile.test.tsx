import { fireEvent, waitFor } from "@testing-library/react-native";

import { ProfileManagement } from "./Profile";
import * as AcademiesAPI from "@services/products/academy";
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

describe("<ProfileManagement />", () => {
  it("renders correctly", async () => {
    jest.spyOn(AcademiesAPI, "getFacilityOptions").mockResolvedValue([]);
    jest
      .spyOn(AcademiesAPI, "getAcademyDetail")
      .mockResolvedValue(sampleAcademyDetail);
    const { getByTestId } = renderWithProviders(<ProfileManagement />);

    await waitFor(() => fireEvent.press(getByTestId("intro")));
  });

  it("handles bad response correctly", async () => {
    jest.spyOn(AcademiesAPI, "getFacilityOptions").mockResolvedValue(null);
    jest.spyOn(AcademiesAPI, "getAcademyDetail").mockResolvedValue(null);

    renderWithProviders(<ProfileManagement />);
  });
});
