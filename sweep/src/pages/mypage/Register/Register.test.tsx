import { fireEvent } from "@testing-library/react-native";

import { Register } from "./Register";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

describe("<Register />", () => {
  it("should render without crashing", () => {
    const { getByTestId } = renderWithProviders(<Register />);

    fireEvent.press(getByTestId("academy"));
  });
});
