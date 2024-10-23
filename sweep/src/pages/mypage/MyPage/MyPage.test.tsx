import { fireEvent } from "@testing-library/react-native";

import { MyPage } from "./MyPage";
import * as AuthContext from "@contexts/auth";
import { renderWithProviders } from "@utils/test-utils";

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
  });

  it("renders correctly when logged in and handles buttons", () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      token: "token",
    });
    const { getByTestId } = renderWithProviders(<MyPage />);

    fireEvent.press(getByTestId("recent"));
    fireEvent.press(getByTestId("heart-outline"));
    fireEvent.press(getByTestId("chatbox-outline"));
    fireEvent.press(getByTestId("giftbox"));
    fireEvent.press(getByTestId("lightbulb"));
    fireEvent.press(getByTestId("questionmark-circle"));
    fireEvent.press(getByTestId("bell"));
    fireEvent.press(getByTestId("logout"));
    fireEvent.press(getByTestId("person-minus"));
  });

  it("renders correctly when not logged in", () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      token: null,
    });
    renderWithProviders(<MyPage />);
  });
});
