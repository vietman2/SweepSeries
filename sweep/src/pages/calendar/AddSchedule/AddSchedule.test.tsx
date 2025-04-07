import { Platform } from "react-native";
import { fireEvent, waitFor } from "@testing-library/react-native";
import * as Router from "expo-router";

import { AddSchedule } from "./AddSchedule";
import * as CalendarContext from "@contexts/calendar";
import * as SchedulesAPI from "@services/calendar/schedules";
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
jest.mock("@fragments/Calendar", () => {
  const { TouchableOpacity, View } = jest.requireActual("react-native");

  return {
    AlarmModal: ({
      setAlarmModalOpen,
      handleUpdateAlarm,
    }: {
      setAlarmModalOpen: (value: boolean) => void;
      handleUpdateAlarm: (
        use: boolean,
        newDelta: number,
        newUnit: number
      ) => void;
    }) => (
      <View>
        <TouchableOpacity
          onPress={() => setAlarmModalOpen(false)}
          testID="close-alarm"
        />
        <TouchableOpacity
          onPress={() => handleUpdateAlarm(false, 1, 1)}
          testID="cancel-alarm"
        />
        <TouchableOpacity
          onPress={() => handleUpdateAlarm(true, 1, 0)}
          testID="update-alarm-0"
        />
        <TouchableOpacity
          onPress={() => handleUpdateAlarm(true, 1, 1)}
          testID="update-alarm-1"
        />
        <TouchableOpacity
          onPress={() => handleUpdateAlarm(true, 1, 2)}
          testID="update-alarm-2"
        />
        <TouchableOpacity
          onPress={() => handleUpdateAlarm(true, 1, 3)}
          testID="update-alarm-3"
        />
      </View>
    ),
    ColorModal: ({
      setColorModalOpen,
      handleUpdateColor,
    }: {
      setColorModalOpen: (value: boolean) => void;
      handleUpdateColor: (color: string) => void;
    }) => (
      <View>
        <TouchableOpacity
          onPress={() => setColorModalOpen(false)}
          testID="close-color"
        />
        <TouchableOpacity
          onPress={() => handleUpdateColor("red")}
          testID="update-color"
        />
      </View>
    ),
    RepeatModal: ({
      toggleRepeatModal,
      handleUpdateRepeat,
    }: {
      toggleRepeatModal: (value: boolean) => void;
      handleUpdateRepeat: (
        use: boolean,
        newPeriod: number,
        newBreak: string
      ) => void;
    }) => (
      <View>
        <TouchableOpacity
          onPress={() => toggleRepeatModal(false)}
          testID="close-repeat"
        />
        <TouchableOpacity
          onPress={() => handleUpdateRepeat(false, 1, "day")}
          testID="cancel-repeat"
        />
        <TouchableOpacity
          onPress={() => handleUpdateRepeat(true, 1, "day")}
          testID="update-repeat"
        />
      </View>
    ),
  };
});
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
    ScheduleInput: ({
      text,
      onPress,
    }: {
      text: string;
      onPress: () => void;
    }) => <TouchableOpacity testID={`open-${text}`} onPress={onPress} />,
  };
});

describe("<AddSchedule />", () => {
  beforeEach(() => {
    jest.spyOn(Router, "useLocalSearchParams").mockReturnValue({
      date: "2025-01-01",
    });
    jest.spyOn(CalendarContext, "useCalendar").mockReturnValue({
      calendars: sampleCalendars,
      selectedCalendar: sampleCalendars[0],
      setSelectedCalendar: jest.fn(),
      reloadData: jest.fn(),
      isReady: true,
    });
  });

  it("renders correctly (ios) and handles datetime", async () => {
    jest.spyOn(SchedulesAPI, "createSchedule").mockResolvedValue(true);

    const { getByTestId } = renderWithProviders(<AddSchedule />);

    fireEvent.press(getByTestId("start"));
    fireEvent.press(getByTestId("change-datetime"));
    fireEvent.press(getByTestId("cancel"));
    fireEvent.press(getByTestId("end"));
    fireEvent.press(getByTestId("change-datetime"));
    fireEvent.press(getByTestId("all-day"));

    await waitFor(() => {
      fireEvent.press(getByTestId("등록하기"));
    });
  });

  it("renders correctly (android) and handles alarm", async () => {
    jest.spyOn(SchedulesAPI, "createSchedule").mockResolvedValue(null);
    Platform.OS = "android";

    const { getByTestId } = renderWithProviders(<AddSchedule />);

    await waitFor(() => {
      fireEvent.press(getByTestId("open-알림"));
    });
    fireEvent.press(getByTestId("update-alarm-0"));
    fireEvent.press(getByTestId("update-alarm-1"));
    fireEvent.press(getByTestId("update-alarm-2"));
    fireEvent.press(getByTestId("update-alarm-3"));
    fireEvent.press(getByTestId("cancel-alarm"));
    fireEvent.press(getByTestId("close-alarm"));

    await waitFor(() => {
      fireEvent.press(getByTestId("등록하기"));
    });
  });

  it("handles repeat", async () => {
    const { getByTestId } = renderWithProviders(<AddSchedule />);

    await waitFor(() => {
      fireEvent.press(getByTestId("open-반복"));
      fireEvent.press(getByTestId("cancel-repeat"));
      fireEvent.press(getByTestId("update-repeat"));
      fireEvent.press(getByTestId("close-repeat"));
    });
  });

  it("handles color", async () => {
    const { getByTestId } = renderWithProviders(<AddSchedule />);

    await waitFor(() => {
      fireEvent.press(getByTestId("open-색상"));
      fireEvent.press(getByTestId("update-color"));
      fireEvent.press(getByTestId("close-color"));
    });
  });

  it("handles loading", async () => {
    jest.spyOn(CalendarContext, "useCalendar").mockReturnValue({
      calendars: sampleCalendars,
      selectedCalendar: null,
      setSelectedCalendar: jest.fn(),
      reloadData: jest.fn(),
      isReady: true,
    });

    renderWithProviders(<AddSchedule />);
  });
});
