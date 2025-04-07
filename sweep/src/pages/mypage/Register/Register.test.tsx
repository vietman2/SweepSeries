import { fireEvent } from "@testing-library/react-native";

import { Register } from "./Register";
import { renderWithProviders } from "@utils/test-utils";

describe("<Register />", () => {
  it("should render without crashing", () => {
    const { getByTestId } = renderWithProviders(<Register />);

    fireEvent.press(getByTestId("academy"));
    fireEvent.press(getByTestId("coach"));
  });
});
