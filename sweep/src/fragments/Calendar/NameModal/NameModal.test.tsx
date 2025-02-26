import { fireEvent, waitFor } from "@testing-library/react-native";

import { NameModal } from "./NameModal";
import * as CalendarsAPI from "@services/calendar/calendars";
import { renderWithProviders } from "@utils/test-utils";

describe("<NameModal />", () => {
  it("handles update correctly", async () => {
    jest.spyOn(CalendarsAPI, "updateCalendarInfo").mockResolvedValue(true);

    const { getByTestId } = renderWithProviders(
      <NameModal
        initialName="original"
        nameModalOpen
        setNameModalOpen={jest.fn()}
      />
    );

    fireEvent.changeText(getByTestId("name-input"), "new name");

    await waitFor(() => {
      fireEvent.press(getByTestId("submit"));
    });
  });

  it("handles api error correctly", async () => {
    jest.spyOn(CalendarsAPI, "updateCalendarInfo").mockResolvedValue(null);

    const { getByTestId } = renderWithProviders(
      <NameModal
        initialName="original"
        nameModalOpen
        setNameModalOpen={jest.fn()}
      />
    );

    fireEvent.changeText(getByTestId("name-input"), "new name");

    await waitFor(() => {
      fireEvent.press(getByTestId("submit"));
      fireEvent.press(getByTestId("cancel"));
      fireEvent.press(getByTestId("close-modal"));
    });
  });
});
