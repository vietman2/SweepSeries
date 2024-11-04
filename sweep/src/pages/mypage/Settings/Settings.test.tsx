import { fireEvent } from "@testing-library/react-native";

import { Settings } from "./Settings";
import { renderWithProviders } from "@utils/test-utils";

describe("<Settings />", () => {
  it("renders correctly and handles toggle", () => {
    const { getByTestId } = renderWithProviders(<Settings />);

    fireEvent.press(getByTestId("toggle-1"));
  });
});
