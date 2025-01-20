import { fireEvent, waitFor } from "@testing-library/react-native";
import * as Router from "expo-router";

import { Calendar } from "./Calendar";
import * as CalendarContext from "@contexts/calendar";
import * as CalendarsAPI from "@services/calendar/calendars";
import * as StorageAPI from "@services/storage/asyncstorage";
import { sampleCalendars } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
  useFocusEffect: jest.fn(),
}));
jest.mock("@gorhom/bottom-sheet", () => ({
  __esModule: true,
  default: "BottomSheet",
  BottomSheetBackdrop: () => "BottomSheetBackdrop",
  BottomSheetBackdropProps: null,
  BottomSheetView: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("@contexts/calendar", () => ({
  CalendarProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useCalendar: jest.fn(),
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
    jest.spyOn(CalendarContext, "useCalendar").mockReturnValue({
      calendars: sampleCalendars,
      selectedCalendar: sampleCalendars[0],
      setSelectedCalendar: jest.fn(),
    });
    jest.spyOn(CalendarsAPI, "getCalendars").mockResolvedValue(sampleCalendars);
    jest.spyOn(StorageAPI, "getStorage").mockResolvedValue("1");
  });

  it("handles no calendar error", async () => {
    jest.spyOn(CalendarContext, "useCalendar").mockReturnValue({
      calendars: [],
      selectedCalendar: null,
      setSelectedCalendar: jest.fn(),
    });
    renderWithProviders(<Calendar />);
  });

  it("renders correctly (month >= 10) and open settings", async () => {
      jest.spyOn(Router, "useFocusEffect").mockImplementationOnce((cb) => cb());
    jest.spyOn(StorageAPI, "getStorage").mockResolvedValue(null);
    jest.setSystemTime(new Date("2024-10-01").getTime());

    const { getByTestId } = renderWithProviders(<Calendar />);

    await waitFor(() => fireEvent.press(getByTestId("open-settings")));
  });

  it("renders correctly (month < 10) and handles search", async () => {
    const { getByTestId } = renderWithProviders(<Calendar />);

    await waitFor(() => {
      fireEvent.press(getByTestId("open-list"));
      fireEvent.press(getByTestId("search"));
    });
  });

  it("handles calendar select and create", async () => {
    jest.spyOn(StorageAPI, "saveStorage").mockResolvedValue(undefined);
    jest.spyOn(CalendarsAPI, "createCalendar").mockResolvedValue(true);
    const { getByTestId } = renderWithProviders(<Calendar />);

    await waitFor(() => {
      fireEvent.press(getByTestId("calendar-1"));
      fireEvent.press(getByTestId("create-calendar"));
      fireEvent.press(getByTestId("close-buttons"));
    });
  });

  it("handles day navigate and create fail", async () => {
    jest.spyOn(CalendarsAPI, "createCalendar").mockResolvedValue(null);
    const { getByTestId } = renderWithProviders(<Calendar />);

    await waitFor(() => {
      fireEvent.press(getByTestId("day-2024-01-01"));
      fireEvent.press(getByTestId("create-calendar"));
    });
  });
});
