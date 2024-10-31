import { Calendar } from "react-native-calendars";
import { fireEvent } from "@testing-library/react-native";

import { CalendarHeader, CustomHeader } from "./CalendarHeader";
import { CustomDay } from "./CustomDay";
import { renderWithProviders } from "@utils/test-utils";

describe("<CalendarHeader />", () => {
  it("renders and handles add month correctly", () => {
    const { getByTestId } = renderWithProviders(
      <CalendarHeader selectedMonth="2024-01" setSelectedMonth={jest.fn()} />
    );

    fireEvent.press(getByTestId("decrement"));
    fireEvent.press(getByTestId("increment"));
  });

  it("renders and handles add month correctly 2", () => {
    const { getByTestId } = renderWithProviders(
      <CalendarHeader selectedMonth="2024-12" setSelectedMonth={jest.fn()} />
    );

    fireEvent.press(getByTestId("decrement"));
    fireEvent.press(getByTestId("increment"));
  });
});

describe("<CustomHeader />", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProviders(
      <Calendar customHeader={CustomHeader} />
    );

    fireEvent.press(getByTestId("decrement"));
    fireEvent.press(getByTestId("increment"));
  });
});

describe("<CustomDay />", () => {
  const dateData = {
    day: 1,
    month: 1,
    year: 2024,
    timestamp: 0,
    dateString: "2024-01-01",
  };

  it("renders today correctly", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01").getTime());

    renderWithProviders(<CustomDay date={dateData} />);
  });

  it("renders correctly with schedule", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-10-10").getTime());
    const schedule1 = {
      text: "Schedule1",
      type: 1,
    };
    const schedule2 = {
      text: "Schedule2",
      type: 2,
    };

    renderWithProviders(
      <>
        <CustomDay date={dateData} schedule={schedule1} />
        <CustomDay date={dateData} schedule={schedule2} />
      </>
    );
  });
});
