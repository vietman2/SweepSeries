import { fireEvent } from "@testing-library/react-native";

import { LessonDateSelector } from "./DateSelectors";
import { renderWithProviders } from "@utils/test-utils";

describe("<LessonDateSelector />", () => {
  beforeAll(() => {
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-01-01").getTime());
  });

  it("should render correctly", () => {
    const { getByTestId } = renderWithProviders(
      <LessonDateSelector
        selectedDate="2025-01-01"
        setSelectedDate={jest.fn()}
      />
    );

    fireEvent.press(getByTestId("day-2025-01-31"));
    fireEvent.press(getByTestId("increment"));
    fireEvent.press(getByTestId("day-2025-02-15")); // check if month is incremented
    fireEvent.press(getByTestId("decrement"));
    fireEvent.press(getByTestId("day-2025-01-15"));
  });
});
