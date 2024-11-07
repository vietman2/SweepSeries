import { fireEvent } from "@testing-library/react-native";

import { Calendar } from "./Calendar";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));
jest.mock("@gorhom/bottom-sheet", () => ({
  __esModule: true,
  default: "BottomSheet",
  BottomSheetBackdrop: () => "BottomSheetBackdrop",
  BottomSheetBackdropProps: null,
  BottomSheetView: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("@fragments/Calendar", () => ({
  CalendarButtons: () => <div>CalendarButtons</div>,
  CalendarTitle: () => <div>CalendarTitle</div>,
  CalendarSimple: () => <div>CalendarSimple</div>,
}));

describe("<Calendar />", () => {
  it("renders correctly (month >= 10) and open settings", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-10-01").getTime());

    const { getByTestId } = renderWithProviders(<Calendar />);

    fireEvent.press(getByTestId("open-settings"));
  });

  it("renders correctly (month < 10)", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01").getTime());

    const { getByTestId } = renderWithProviders(<Calendar />);

    fireEvent.press(getByTestId("open-list"));
  });

  it("handles calendar select", () => {
    const { getByTestId } = renderWithProviders(<Calendar />);

    fireEvent.press(getByTestId("calendar-1"));
    fireEvent.press(getByTestId("close-buttons"));
  });
});
