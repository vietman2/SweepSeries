import { fireEvent, waitFor } from "@testing-library/react-native";
import * as Router from "expo-router";

import { Calendar } from "./Calendar";
import * as AuthContext from "@contexts/auth";
import * as CalendarContext from "@contexts/calendar";
import * as CalendarsAPI from "@services/calendar/calendars";
import { sampleAuthor } from "@testdata/auth";
import { sampleCalendars, sampleScheduleResponse } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

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
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01").getTime());
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      selectedProfile: sampleAuthor,
      mode: "pro",
    });
    jest.spyOn(CalendarContext, "useCalendar").mockReturnValue({
      calendars: sampleCalendars,
      selectedCalendar: sampleCalendars[0],
      setSelectedCalendar: jest.fn(),
      reloadData: jest.fn(),
      isReady: true,
    });
    jest
      .spyOn(CalendarsAPI, "getMonthlyData")
      .mockResolvedValue(sampleScheduleResponse);
  });

  it("handles no profile error", async () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      selectedProfile: null,
      mode: "pro",
    });
    waitFor(() => renderWithProviders(<Calendar />));
  });

  it("renders loading component", async () => {
    jest.spyOn(CalendarContext, "useCalendar").mockReturnValue({
      calendars: [],
      selectedCalendar: null,
      setSelectedCalendar: jest.fn(),
      reloadData: jest.fn(),
      isReady: false,
    });
    waitFor(() => renderWithProviders(<Calendar />));
  });

  it("renders error", async () => {
    jest.spyOn(CalendarContext, "useCalendar").mockReturnValue({
      calendars: [],
      selectedCalendar: null,
      setSelectedCalendar: jest.fn(),
      reloadData: jest.fn(),
      isReady: true,
    });
    waitFor(() => renderWithProviders(<Calendar />));
  });

  it("renders correctly (month >= 10) and handles buttons", async () => {
    jest.setSystemTime(new Date("2024-10-01").getTime());

    const { getByTestId } = renderWithProviders(<Calendar />);

    await waitFor(() => {
      fireEvent.press(getByTestId("open-list")); // Open Calendars List
      fireEvent.press(getByTestId("calendar-2")); // Switch to Calendar 2
      fireEvent.press(getByTestId("search")); // Press search
      fireEvent.press(getByTestId("open-settings")); // Open Settings
      fireEvent.press(getByTestId("day-2024-10-01")); // Open Daily Schedules
    });
  });

  it("handles api error", async () => {
    jest.spyOn(Router, "useFocusEffect").mockImplementationOnce((cb) => cb());
    jest
      .spyOn(CalendarsAPI, "getMonthlyData")
      .mockResolvedValue(null);
    jest.setSystemTime(new Date("2024-01-01").getTime());

    const { getByTestId } = renderWithProviders(<Calendar />);

    await waitFor(() => {
      fireEvent.press(getByTestId("close-buttons")); // Close Modals
    });
  });
});
