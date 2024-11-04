import { fireEvent } from "@testing-library/react-native";

import { Introduction } from "./Introduction";
import { renderWithProviders } from "@utils/test-utils";

describe("<Introduction />", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProviders(
      <Introduction introduction="Introduction" />
    );

    fireEvent.press(getByTestId("expand-button"));
    fireEvent.press(getByTestId("expand-button"));
  });
});
