import { fireEvent, waitFor } from "@testing-library/react-native";
import * as Router from "expo-router";

import { DailySchedule } from "./DailySchedule";
import * as CalendarContext from "@contexts/calendar";
import * as CalendarsAPI from "@services/calendar/calendars";
import * as DiariesAPI from "@services/calendar/diaries";
import * as TodosAPI from "@services/calendar/todos";
import {
  sampleCalendars,
  sampleSchedules,
  sampleTodos,
} from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-status-bar", () => ({
  StatusBar: () => null,
}));
jest.mock("@fragments/Schedule", () => ({
  ScheduleSimple: () => <div />,
}));
jest.mock("@fragments/Todo", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    TodoSimple: ({ onPress }: { onPress: () => void }) => (
      <TouchableOpacity onPress={onPress} testID="todo" />
    ),
  };
});

describe("<DailySchedule />", () => {
  beforeEach(() => {
    jest
      .spyOn(Router, "useLocalSearchParams")
      .mockReturnValue({ date: "2025-01-01" });
    jest.spyOn(CalendarContext, "useCalendar").mockReturnValue({
      selectedCalendar: sampleCalendars[0],
      calendars: sampleCalendars,
      isReady: true,
      setSelectedCalendar: jest.fn(),
      reloadData: jest.fn(),
    });
    jest.spyOn(CalendarsAPI, "getDailyData").mockResolvedValue({
      events: sampleSchedules,
      lessons: sampleSchedules,
      todos: sampleTodos,
      diary: "test",
    });
  });

  it("handles navigate and toggle todo correctly", async () => {
    jest.spyOn(TodosAPI, "toggleTodoStatus").mockResolvedValueOnce(true);

    const { getByTestId, getAllByTestId } = renderWithProviders(
      <DailySchedule />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("addschedule"));
      fireEvent.press(getByTestId("addtodo"));
      fireEvent.press(getByTestId("addlesson"));
      fireEvent.press(getAllByTestId("todo")[0]);
    });

    jest.spyOn(TodosAPI, "toggleTodoStatus").mockResolvedValueOnce(null);

    await waitFor(() => {
      fireEvent.press(getAllByTestId("todo")[0]);
    });
  });

  it("handles diary correctly", async () => {
    jest.spyOn(CalendarsAPI, "getDailyData").mockResolvedValue({
      events: sampleSchedules,
      lessons: sampleSchedules,
      todos: sampleTodos,
      diary: "",
    });
    jest.spyOn(DiariesAPI, "createDiary").mockResolvedValueOnce(true);

    const { getByTestId, getByText } = renderWithProviders(<DailySchedule />);

    await waitFor(() => {
      fireEvent.press(getByTestId("toggle-mode"));
      fireEvent.press(getByText("취소"));
      fireEvent.press(getByTestId("toggle-mode"));
      fireEvent.press(getByText("저장"));
    });

    jest.spyOn(DiariesAPI, "createDiary").mockResolvedValueOnce(null);

    await waitFor(() => {
      fireEvent.press(getByTestId("toggle-mode"));
      fireEvent.press(getByText("저장"));
    });
  });

  it("handles api error and no calendar", async () => {
    jest.spyOn(CalendarContext, "useCalendar").mockReturnValue({
      selectedCalendar: null,
      calendars: [],
      isReady: true,
      setSelectedCalendar: jest.fn(),
      reloadData: jest.fn(),
    });
    jest.spyOn(CalendarsAPI, "getDailyData").mockResolvedValue(null);

    renderWithProviders(<DailySchedule />);
  });
});
