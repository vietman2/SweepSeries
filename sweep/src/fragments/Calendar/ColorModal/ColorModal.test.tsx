import { fireEvent } from "@testing-library/react-native";

import { ColorModal } from "./ColorModal";
import * as CalendarsAPI from "@services/calendar/calendars";
import { renderWithProviders } from "@utils/test-utils";

describe("<ColorModal />", () => {
  it("handles color update", () => {
    jest.spyOn(CalendarsAPI, "updateCalendarInfo").mockResolvedValue(true);

    const { getByTestId } = renderWithProviders(
      <ColorModal
        colorModalOpen
        setColorModalOpen={jest.fn()}
        selectedColor="#FF6B6B"
      />
    );

    fireEvent.press(getByTestId("select-color-#FF6B6B"));
  });

  it("handles api error", () => {
    jest.spyOn(CalendarsAPI, "updateCalendarInfo").mockResolvedValue(null);

    const { getByTestId } = renderWithProviders(
      <ColorModal
        colorModalOpen
        setColorModalOpen={jest.fn()}
        selectedColor="#FF6B6B"
      />
    );

    fireEvent.press(getByTestId("select-color-#FF6B6B"));
    fireEvent.press(getByTestId("close-color-modal"));
  });
});
