import { Platform } from "react-native";
import { fireEvent } from "@testing-library/react-native";

import { AddSchedule } from "./AddSchedule";
import * as CalendarContext from "@contexts/calendar";
import { sampleCalendars } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");

  RN.Platform.OS = "ios";

  return RN;
});
jest.mock("@contexts/calendar", () => ({
  CalendarProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useCalendar: jest.fn(),
}));
jest.mock("@fragments/Calendar", () => ({
  AlarmModal: () => null,
  ColorModal: () => null,
  RepeatModal: () => null,
}));
jest.mock("@fragments/Schedule", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    DateTimeHeader: ({
      handleEndMode,
      handleStartMode,
    }: {
      handleEndMode: () => void;
      handleStartMode: () => void;
    }) => (
      <div>
        <TouchableOpacity onPress={handleStartMode} testID="start" />
        <TouchableOpacity onPress={handleEndMode} testID="end" />
      </div>
    ),
    ScheduleInput: () => null,
  };
});

describe("<AddSchedule />", () => {
  beforeEach(() => {
    jest.spyOn(CalendarContext, "useCalendar").mockReturnValue({
      calendars: sampleCalendars,
      selectedCalendar: sampleCalendars[0],
      setSelectedCalendar: jest.fn(),
    });
  });

  it("renders correctly (ios)", () => {
    Platform.OS = "ios";

    const { getByTestId } = renderWithProviders(<AddSchedule />);

    fireEvent.press(getByTestId("start"));
    fireEvent.press(getByTestId("change-datetime"));
    fireEvent.press(getByTestId("cancel"));
    fireEvent.press(getByTestId("end"));
    fireEvent.press(getByTestId("change-datetime"));
    fireEvent.press(getByTestId("all-day"));
  });

  it("renders correctly (android)", () => {
    Platform.OS = "android";

    const { getByTestId } = renderWithProviders(<AddSchedule />);

    fireEvent.press(getByTestId("change-datetime"));
    fireEvent.press(getByTestId("cancel"));
  });
});
