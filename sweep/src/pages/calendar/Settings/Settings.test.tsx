import { fireEvent } from "@testing-library/react-native";

import { Settings } from "./Settings";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({ calendarId: "1" })),
}));
jest.mock("@gorhom/bottom-sheet", () => {
  return {
    __esModule: true,
    default: "BottomSheet",
    BottomSheetBackdrop: () => "BottomSheetBackdrop",
    BottomSheetBackdropProps: null,
    BottomSheetView: ({ children }: { children: React.ReactNode }) => children,
  };
});
jest.mock("@fragments/Calendar", () => ({
  CalendarMembers: () => "CalendarMembers",
  CalendarOptions: () => "CalendarOptions",
}));

describe("<Settings />", () => {
  it("should render and handles toggle", () => {
    const { getAllByTestId, getByTestId } = renderWithProviders(<Settings />);

    fireEvent.press(getAllByTestId("toggle")[0]);
    fireEvent.press(getAllByTestId("toggle")[1]);
    fireEvent.press(getByTestId("close-modal"));
    fireEvent.press(getByTestId("확인"));
  });
});
