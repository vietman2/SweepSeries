import { fireEvent } from "@testing-library/react-native";

import { CalendarButtons } from "./CalendarButtons";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

describe("<CalendarButtons />", () => {
  it("renders open correctly and handles buttons", () => {
    const { getByTestId } = renderWithProviders(
      <CalendarButtons open setOpen={jest.fn()} />
    );

    fireEvent.press(getByTestId("addmemo"));
    fireEvent.press(getByTestId("addtodo"));
    fireEvent.press(getByTestId("addschedule"));
  });

  it("renders closed correctly", () => {
    const { getByTestId } = renderWithProviders(
      <CalendarButtons open={false} setOpen={jest.fn()} />
    );

    fireEvent.press(getByTestId("open"));
  });
});
