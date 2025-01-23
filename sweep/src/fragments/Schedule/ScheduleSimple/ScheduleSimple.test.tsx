import React from "react";
import { fireEvent } from "@testing-library/react-native";

import { ScheduleSimple } from "./ScheduleSimple";
import { sampleSchedules } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
}));

describe("<ScheduleSimple />", () => {
  it("should render without crashing", () => {
    const { getByTestId } = renderWithProviders(
      <>
        <ScheduleSimple schedule={sampleSchedules[0]} />
        <ScheduleSimple schedule={sampleSchedules[1]} />
        <ScheduleSimple schedule={sampleSchedules[2]} />
      </>
    );

    fireEvent.press(getByTestId("schedule-simple-1"));
    fireEvent.press(getByTestId("schedule-simple-2"));
    fireEvent.press(getByTestId("schedule-simple-3"));
  });
});
