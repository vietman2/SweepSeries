import { fireEvent } from "@testing-library/react-native";

import { CalendarMembers } from "./CalendarMembers";
import { sampleCalendars } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

describe("<CalendarMembers />", () => {
  it("handle toggle between expand and collapse", () => {
    const { getByTestId } = renderWithProviders(
      <CalendarMembers calendar={sampleCalendars[1]} />
    );

    fireEvent.press(getByTestId("expand"));
    fireEvent.press(getByTestId("collapse"));
  });
});
