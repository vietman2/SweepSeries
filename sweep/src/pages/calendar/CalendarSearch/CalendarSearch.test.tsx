import { fireEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import { CalendarSearch } from "./CalendarSearch";
import { renderWithProviders } from "@utils/test-utils";

describe("<CalendarSearch />", () => {
  it("renders and handles go back correctly", () => {
    jest.spyOn(router, "canGoBack").mockReturnValue(true);
    const { getByTestId } = renderWithProviders(<CalendarSearch />);

    fireEvent.press(getByTestId("back"));
  });

  it("handles go back correctly 2", () => {
    jest.spyOn(router, "canGoBack").mockReturnValue(false);

    const { getByTestId } = renderWithProviders(<CalendarSearch />);

    fireEvent.press(getByTestId("back"));
  });
});
