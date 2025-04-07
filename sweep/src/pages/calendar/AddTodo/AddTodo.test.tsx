import { fireEvent, waitFor } from "@testing-library/react-native";
import * as Router from "expo-router";

import { AddTodo } from "./AddTodo";
import * as TodosAPI from "@services/calendar/todos";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@contexts/calendar", () => ({
  CalendarProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useCalendar: () => ({
    selectedCalendar: { id: 1 },
  }),
}));
jest.mock("@fragments/Calendar", () => {
  const { TouchableOpacity, View } = jest.requireActual("react-native");

  return {
    ColorModal: ({
      setColorModalOpen,
      handleUpdateColor,
    }: {
      setColorModalOpen: (value: boolean) => void;
      handleUpdateColor: (color: string) => void;
    }) => (
      <View>
        <TouchableOpacity
          onPress={() => setColorModalOpen(true)}
          testID="open-color-modal"
        />
        <TouchableOpacity
          onPress={() => handleUpdateColor("#FF6B6B")}
          testID="update-color"
        />
      </View>
    ),
  };
});
jest.mock("@fragments/Schedule", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    ScheduleInput: ({
      text,
      onPress,
    }: {
      text: string;
      onPress: () => void;
    }) => <TouchableOpacity onPress={onPress} testID={text} />,
  };
});

describe("<AddTodo />", () => {
  beforeEach(() => {
    jest
      .spyOn(Router, "useLocalSearchParams")
      .mockReturnValue({ date: "2021-07-02" });
  });

  it("handles create", async () => {
    jest.spyOn(TodosAPI, "createTodo").mockResolvedValue(true);
    const { getByTestId } = renderWithProviders(<AddTodo />);

    await waitFor(() => {
      fireEvent.changeText(getByTestId("할 일을 입력하세요."), "할 일 1");
      fireEvent.press(getByTestId("change-datetime"));
      fireEvent.press(getByTestId("cancel"));
      fireEvent.press(getByTestId("open-color-modal"));
      fireEvent.press(getByTestId("색상"));
      fireEvent.press(getByTestId("update-color"));
      fireEvent.press(getByTestId("등록하기"));
    });
  });

  it("handles create fail", async () => {
    jest.spyOn(TodosAPI, "createTodo").mockResolvedValue(null);
    const { getByTestId } = renderWithProviders(<AddTodo />);

    await waitFor(() => {
      fireEvent.press(getByTestId("등록하기"));
    });
  });
});
