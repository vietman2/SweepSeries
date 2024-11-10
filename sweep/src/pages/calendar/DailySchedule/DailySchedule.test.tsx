import * as Router from "expo-router";

import { DailySchedule } from "./DailySchedule";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Todo", () => ({
  TodoSimple: () => <div />,
}));

describe("<DailySchedule />", () => {
  it("should render no schedule", () => {
    jest
      .spyOn(Router, "useLocalSearchParams")
      .mockReturnValue({ date: "2021-07-01" });

    renderWithProviders(<DailySchedule />);
  });

  it("should render schedules", () => {
    jest
      .spyOn(Router, "useLocalSearchParams")
      .mockReturnValue({ date: "2024-11-09" });

    renderWithProviders(<DailySchedule />);
  });
});
