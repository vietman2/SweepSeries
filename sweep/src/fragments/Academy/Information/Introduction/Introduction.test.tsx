import { fireEvent } from "@testing-library/react-native";

import { Introduction } from "./Introduction";
import { renderWithProviders } from "@utils/test-utils";

describe("<Introduction />", () => {
  it("renders and handles modal correctly", () => {
    const { getByTestId } = renderWithProviders(
      <Introduction introduction="Introduction" />
    );

    fireEvent.press(getByTestId("expand-button"));
    fireEvent.press(getByTestId("expand-button"));
    fireEvent.press(getByTestId("open"));
    fireEvent.press(getByTestId("hide"));
    fireEvent.press(getByTestId("open"));
    fireEvent.press(getByTestId("저장"));
  });
});
