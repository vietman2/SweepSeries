import { fireEvent } from "@testing-library/react-native";
import * as Router from "expo-router";

import { DailySchedule } from "./DailySchedule";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
  router: {
    replace: jest.fn(),
  },
}));
jest.mock("@fragments/Schedule", () => ({
  ScheduleSimple: () => <div />,
}));
jest.mock("@fragments/Todo", () => ({
  TodoSimple: () => <div />,
}));

describe("<DailySchedule />", () => {
  it("should render no schedule", () => {
    jest
      .spyOn(Router, "useLocalSearchParams")
      .mockReturnValue({ date: "2021-07-02" });

    const { getByTestId } = renderWithProviders(<DailySchedule />);

    fireEvent.press(getByTestId("schedule"));
  });

  it("should render schedules and handle edit mode", () => {
    jest
      .spyOn(Router, "useLocalSearchParams")
      .mockReturnValue({ date: "2024-11-09" });

    const { getByTestId } = renderWithProviders(<DailySchedule />);

    fireEvent.press(getByTestId("toggle-mode"));
  });
});
