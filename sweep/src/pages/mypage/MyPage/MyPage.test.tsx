import { fireEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import { MyPage } from "./MyPage";
import * as AuthContext from "@contexts/auth";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    canDismiss: jest.fn(),
    dismissAll: jest.fn(),
    replace: jest.fn(),
    push: jest.fn(),
  },
}));
jest.mock("@contexts/auth", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAuth: jest.fn(),
}));
jest.mock("@fragments/Profile", () => ({
  MainProfile: () => null,
}));

describe("<MyPage />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      mode: "normal",
      isAuthenticated: true,
    });
  });

  it("renders correctly when logged in and handles buttons", () => {
    const { getByTestId } = renderWithProviders(<MyPage />);

    fireEvent.press(getByTestId("heart-outline"));
    fireEvent.press(getByTestId("chatbox-outline"));
    fireEvent.press(getByTestId("giftbox"));
    fireEvent.press(getByTestId("lightbulb"));
    fireEvent.press(getByTestId("questionmark-circle"));
    fireEvent.press(getByTestId("bell"));
    fireEvent.press(getByTestId("person-minus"));
  });

  it("renders correctly and handles logout with no dismiss", () => {
    jest.spyOn(router, "canDismiss").mockReturnValue(false);
    const { getByTestId } = renderWithProviders(<MyPage />);

    fireEvent.press(getByTestId("logout"));
  });

  it("renders correctly and handles logout with no dismiss", () => {
    jest.spyOn(router, "canDismiss").mockReturnValue(true);
    const { getByTestId } = renderWithProviders(<MyPage />);

    fireEvent.press(getByTestId("logout"));
  });

  it("renders correctly when not logged in", () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      mode: "guest",
      isAuthenticated: false,
    });
    renderWithProviders(<MyPage />);
  });
});
