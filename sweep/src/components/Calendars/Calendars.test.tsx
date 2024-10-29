import { fireEvent } from "@testing-library/react-native";

import { CalendarHeader } from "./CalendarHeader";
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
