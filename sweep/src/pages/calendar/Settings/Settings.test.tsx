import { fireEvent, waitFor } from "@testing-library/react-native";

import { Settings } from "./Settings";
import * as CalendarsAPI from "@services/calendar/calendars";
import { sampleCalendars } from "@testdata/calendar";
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
  beforeEach(() => {
    jest
      .spyOn(CalendarsAPI, "getCalendar")
      .mockResolvedValue(sampleCalendars[0]);
  });

  it("should render and handles toggle", async () => {
    jest.spyOn(CalendarsAPI, "toggleCalendarNotification").mockResolvedValue(true);
    jest.spyOn(CalendarsAPI, "toggleCalendarDaily").mockResolvedValue(true);
    jest.spyOn(CalendarsAPI, "deleteCalendar").mockResolvedValue(true);
    const { getAllByTestId, getByTestId } = renderWithProviders(<Settings />);

    await waitFor(() => {
      fireEvent.press(getAllByTestId("toggle")[1]); // 오늘 알림 끄기
      fireEvent.press(getAllByTestId("toggle")[1]); // 오늘 알림 켜기
      fireEvent.press(getByTestId("change-datetime")); // 시간 변경
      fireEvent.press(getByTestId("확인"));
      fireEvent.press(getAllByTestId("toggle")[0]); // 알림 끄기
      fireEvent.press(getAllByTestId("toggle")[0]); // 알림 켜기
      fireEvent.press(getAllByTestId("toggle")[1]); // 오늘 알림 켜기
      fireEvent.press(getByTestId("change-datetime"));
      fireEvent.press(getByTestId("확인"));
      fireEvent.press(getByTestId("close-modal"));
      fireEvent.press(getByTestId("캘린더 삭제하기"));
    });
  });

  it("handles toggle and delete fail", async () => {
    jest
      .spyOn(CalendarsAPI, "toggleCalendarNotification")
      .mockResolvedValue(null);
    jest.spyOn(CalendarsAPI, "toggleCalendarDaily").mockResolvedValue(null);
    jest.spyOn(CalendarsAPI, "deleteCalendar").mockResolvedValue(null);
    const { getAllByTestId, getByTestId } = renderWithProviders(<Settings />);

    await waitFor(() => {
      fireEvent.press(getAllByTestId("toggle")[1]);
      fireEvent.press(getByTestId("change-datetime"));
      fireEvent.press(getByTestId("확인"));
      fireEvent.press(getAllByTestId("toggle")[0]);
      fireEvent.press(getByTestId("캘린더 삭제하기"));
    });
  });

  it("handles daily toggle on", async () => {
    jest
      .spyOn(CalendarsAPI, "getCalendar")
      .mockResolvedValue({...sampleCalendars[0], notifications_today: false, is_owner: false});
    const { getAllByTestId } = renderWithProviders(<Settings />);

    await waitFor(() => {
      fireEvent.press(getAllByTestId("toggle")[1]);
    });
  });

  it("handles api error", async () => {
    jest
      .spyOn(CalendarsAPI, "getCalendar")
      .mockResolvedValue(null);
    renderWithProviders(<Settings />);
  });
});
