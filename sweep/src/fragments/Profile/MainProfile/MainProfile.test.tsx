import { fireEvent } from "@testing-library/react-native";

import { MainProfile } from "./MainProfile";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: "LinearGradient",
}));
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

describe("<MainProfile>", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProviders(<MainProfile />);

    fireEvent.press(getByTestId("edit-profile"));
  });
});
