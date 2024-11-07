import { fireEvent } from "@testing-library/react-native";

import { CalendarOptions } from "./CalendarOptions";
import { sampleCalendars } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

describe("<CalendarOptions />", () => {
  it("renders correctly and handles modals", () => {
    const { getByTestId } = renderWithProviders(
      <CalendarOptions calendar={sampleCalendars[0]} />
    );

    fireEvent.press(getByTestId("open-name-modal"));
    fireEvent.press(getByTestId("close-name-modal"));
    fireEvent.press(getByTestId("open-name-modal"));
    fireEvent.press(getByTestId("cancel-name-modal"));
    fireEvent.press(getByTestId("open-name-modal"));
    fireEvent.press(getByTestId("confirm-name-modal"));
    fireEvent.press(getByTestId("open-color-modal"));
    fireEvent.press(getByTestId("close-color-modal"));
    fireEvent.press(getByTestId("open-color-modal"));
    fireEvent.press(getByTestId("cancel-color-modal"));
  });
});
