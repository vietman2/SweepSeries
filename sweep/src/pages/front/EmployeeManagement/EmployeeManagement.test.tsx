import { fireEvent, waitFor } from "@testing-library/react-native";

import { EmployeeManagement } from "./EmployeeManagement";
import * as AcademyFrontContext from "@contexts/front";
import { sampleCoaches } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Coach", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    CoachRequest: ({ onRefresh }: { onRefresh: () => void }) => (
      <TouchableOpacity onPress={onRefresh} testID="request" />
    ),
    CoachSimple: () => <div>CoachSimple</div>,
  };
});

describe("<EmployeeManagement />", () => {
  const defaultContext = {
    academy: null,
    programs: [],
    notices: [],
    coaches: sampleCoaches,
    requests: [sampleCoaches[0]],
    facilityOptions: [],
    loading: false,
    refresh: jest.fn(),
  };

  beforeEach(() => {
    jest
      .spyOn(AcademyFrontContext, "useAcademyFront")
      .mockReturnValue(defaultContext);
  });

  it("renders correctly", async () => {
    const { getByTestId } = renderWithProviders(<EmployeeManagement />);

    await waitFor(() => {
      fireEvent.press(getByTestId("request"));
    });
  });

  it("handles data fetch error", async () => {
    jest
      .spyOn(AcademyFrontContext, "useAcademyFront")
      .mockReturnValue({ ...defaultContext, coaches: [] });

    const { getByText } = renderWithProviders(<EmployeeManagement />);

    await waitFor(() => {
      expect(getByText("등록된 코치가 없습니다.")).toBeTruthy();
    });
  });
});
