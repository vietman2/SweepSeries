import { fireEvent, waitFor } from "@testing-library/react-native";

import { EmployeeManagement } from "./EmployeeManagement";
import * as CoachesAPI from "@services/products/coach";
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
  it("renders correctly", async () => {
    jest.spyOn(CoachesAPI, "getEmployedCoaches").mockResolvedValue({
      accepted: [sampleCoaches[0], sampleCoaches[1]],
      pending: [sampleCoaches[2]],
    });
    const { getByTestId } = renderWithProviders(<EmployeeManagement />);

    await waitFor(() => {
      fireEvent.press(getByTestId("request"));
    });
  });

  it("handles data fetch error", async () => {
    jest.spyOn(CoachesAPI, "getEmployedCoaches").mockResolvedValue(null);
    const { getByText } = renderWithProviders(<EmployeeManagement />);

    await waitFor(() => {
      expect(getByText("등록된 코치가 없습니다.")).toBeTruthy();
    });
  });
});
