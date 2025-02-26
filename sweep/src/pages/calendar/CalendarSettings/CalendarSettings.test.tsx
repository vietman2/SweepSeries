import { fireEvent, waitFor } from "@testing-library/react-native";

import { CalendarSettings } from "./CalendarSettings";
import * as CalendarContext from "@contexts/calendar";
import * as CalendarsAPI from "@services/calendar/calendars";
import { sampleCalendars } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));
jest.mock("@gorhom/bottom-sheet", () => ({
  __esModule: true,
  default: "BottomSheet",
  BottomSheetView: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("@fragments/Calendar", () => ({
  ColorModal: () => <div>ColorModal</div>,
  NameModal: () => <div>NameModal</div>,
}));

describe("<CalendarSettings />", () => {
  beforeEach(() => {
    jest.spyOn(CalendarContext, "useCalendar").mockReturnValue({
      calendars: sampleCalendars,
      selectedCalendar: sampleCalendars[0],
      setSelectedCalendar: jest.fn(),
      reloadData: jest.fn(),
      isReady: true,
    });
    jest
      .spyOn(CalendarsAPI, "toggleCalendarNotification")
      .mockResolvedValue(true);
    jest.spyOn(CalendarsAPI, "toggleCalendarDaily").mockResolvedValue(true);
  });

  it("handles config error", async () => {
    jest.spyOn(CalendarContext, "useCalendar").mockReturnValue({
      calendars: [],
      selectedCalendar: null,
      setSelectedCalendar: jest.fn(),
      reloadData: jest.fn(),
      isReady: true,
    });

    renderWithProviders(<CalendarSettings />);
  });

  it("handles notification settings to off", async () => {
    const { getAllByTestId, getByTestId } = renderWithProviders(
      <CalendarSettings />
    );

    jest
      .spyOn(CalendarsAPI, "toggleCalendarNotification")
      .mockResolvedValueOnce(null);
    jest.spyOn(CalendarsAPI, "toggleCalendarDaily").mockResolvedValueOnce(null);

    await waitFor(() => {
      fireEvent.press(getAllByTestId("toggle")[1]); // toggle notifications today fail
      fireEvent.press(getAllByTestId("toggle")[0]); // toggle notifications fail
    });

    jest
      .spyOn(CalendarsAPI, "toggleCalendarNotification")
      .mockResolvedValueOnce(true);
    jest.spyOn(CalendarsAPI, "toggleCalendarDaily").mockResolvedValueOnce(true);

    await waitFor(() => {
      fireEvent.press(getAllByTestId("toggle")[1]); // toggle notifications today
      fireEvent.press(getAllByTestId("toggle")[0]); // toggle notifications
    });
    fireEvent.press(getByTestId("close-modal")); // close modal
  });

  it("handles notification setting to on", async () => {
    jest.spyOn(CalendarContext, "useCalendar").mockReturnValue({
      calendars: sampleCalendars,
      selectedCalendar: {
        ...sampleCalendars[0],
        notifications: false,
        notifications_today: false,
      },
      setSelectedCalendar: jest.fn(),
      reloadData: jest.fn(),
      isReady: true,
    });
    const { getAllByTestId } = renderWithProviders(<CalendarSettings />);

    await waitFor(() => {
      fireEvent.press(getAllByTestId("toggle")[0]); // toggle notifications
    });
  });

  it("handles daily notifications settings to on", async () => {
    jest.spyOn(CalendarContext, "useCalendar").mockReturnValue({
      calendars: sampleCalendars,
      selectedCalendar: {
        ...sampleCalendars[0],
        notifications: true,
        notifications_today: false,
      },
      setSelectedCalendar: jest.fn(),
      reloadData: jest.fn(),
      isReady: true,
    });
    const { getAllByTestId, getByTestId } = renderWithProviders(
      <CalendarSettings />
    );

    jest.spyOn(CalendarsAPI, "toggleCalendarDaily").mockResolvedValueOnce(null);
    await waitFor(() => {
      fireEvent.press(getAllByTestId("toggle")[1]); // toggle notifications
      fireEvent.press(getByTestId("cancel")); // cancel picker
      fireEvent.press(getByTestId("change-datetime")); // set datetime
      fireEvent.press(getByTestId("취소")); // submit
      fireEvent.press(getByTestId("확인")); // submit
    });

    jest.spyOn(CalendarsAPI, "toggleCalendarDaily").mockResolvedValueOnce(true);
    await waitFor(() => {
      fireEvent.press(getByTestId("확인")); // submit
    });
  });

  it("handles personal calendar settings", async () => {
    const { getByTestId } = renderWithProviders(<CalendarSettings />);

    await waitFor(() => {
      fireEvent.press(getByTestId("open-name-modal")); // change name
      fireEvent.press(getByTestId("open-color-modal")); // change color
    });
  });

  it("handles academy calendar settings", async () => {
    jest.spyOn(CalendarContext, "useCalendar").mockReturnValue({
      calendars: sampleCalendars,
      selectedCalendar: {
        ...sampleCalendars[0],
        role: "owner",
        type: "academy",
        scope: 1,
      },
      setSelectedCalendar: jest.fn(),
      reloadData: jest.fn(),
      isReady: true,
    });
    const { getByTestId } = renderWithProviders(<CalendarSettings />);

    jest.spyOn(CalendarsAPI, "switchCalendarScope").mockResolvedValueOnce(null);

    await waitFor(() => fireEvent.press(getByTestId("scope1")));

    jest.spyOn(CalendarsAPI, "switchCalendarScope").mockResolvedValue(true);

    await waitFor(() => {
      fireEvent.press(getByTestId("scope2"));
      fireEvent.press(getByTestId("scope3"));
    });
  });

  it("renders scope 2", async () => {
    jest.spyOn(CalendarContext, "useCalendar").mockReturnValue({
      calendars: sampleCalendars,
      selectedCalendar: {
        ...sampleCalendars[0],
        role: "owner",
        type: "academy",
        scope: 2,
      },
      setSelectedCalendar: jest.fn(),
      reloadData: jest.fn(),
      isReady: true,
    });
    waitFor(() => renderWithProviders(<CalendarSettings />));
  });

  it("renders scope 3", async () => {
    jest.spyOn(CalendarContext, "useCalendar").mockReturnValue({
      calendars: sampleCalendars,
      selectedCalendar: {
        ...sampleCalendars[0],
        role: "owner",
        type: "academy",
        scope: 3,
      },
      setSelectedCalendar: jest.fn(),
      reloadData: jest.fn(),
      isReady: true,
    });
    waitFor(() => renderWithProviders(<CalendarSettings />));
  });
});
