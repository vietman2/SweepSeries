import { fireEvent, waitFor } from "@testing-library/react-native";

import { CalendarOptions } from "./CalendarOptions";
import * as CalendarsAPI from "@services/calendar/calendars";
import { sampleCalendars } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

describe("<CalendarOptions />", () => {
  it("renders correctly and handles modals", async () => {
    jest.spyOn(CalendarsAPI, "updateCalendarInfo").mockResolvedValue(true);
    const { getByTestId } = renderWithProviders(
      <CalendarOptions calendar={sampleCalendars[0]} onRefresh={jest.fn()} />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("open-name-modal"));
      fireEvent.press(getByTestId("close-name-modal"));
      fireEvent.press(getByTestId("open-name-modal"));
      fireEvent.press(getByTestId("cancel-name-modal"));
      fireEvent.press(getByTestId("open-name-modal"));
      fireEvent.press(getByTestId("confirm-name-modal"));
      fireEvent.press(getByTestId("open-color-modal"));
      fireEvent.press(getByTestId("close-color-modal"));
      fireEvent.press(getByTestId("open-color-modal"));
      fireEvent.press(getByTestId("select-color-#FF6B6B"));
    });
  });

  it("handles update fail", async () => {
    jest.spyOn(CalendarsAPI, "updateCalendarInfo").mockResolvedValue(null);
    const { getByTestId } = renderWithProviders(
      <CalendarOptions calendar={sampleCalendars[0]} onRefresh={jest.fn()} />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("open-name-modal"));
      fireEvent.press(getByTestId("confirm-name-modal"));
      fireEvent.press(getByTestId("open-color-modal"));
      fireEvent.press(getByTestId("select-color-#FF6B6B"));
    });
  });
});
