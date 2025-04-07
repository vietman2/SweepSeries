import { fireEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import { MyPage } from "./MyPage";
import * as AuthContext from "@contexts/auth";
import * as AuthAPI from "@services/auth/auth";
import { sampleAuthor } from "@testdata/auth";
import { renderWithProviders } from "@utils/test-utils";

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
      selectedProfile: sampleAuthor,
    });
    jest.spyOn(AuthAPI, "logout").mockResolvedValue(true);
  });

  it("renders correctly when logged in and handles buttons", () => {
    const { getByTestId } = renderWithProviders(<MyPage />);

    fireEvent.press(getByTestId("recent"));
    fireEvent.press(getByTestId("heart-outline"));
    fireEvent.press(getByTestId("chatbox-outline"));
    fireEvent.press(getByTestId("giftbox"));
    fireEvent.press(getByTestId("lightbulb"));
    fireEvent.press(getByTestId("chat"));
    fireEvent.press(getByTestId("questionmark-circle"));
    fireEvent.press(getByTestId("bell"));
    fireEvent.press(getByTestId("person-minus"));
    fireEvent.press(getByTestId("아카데미/코치로 등록하기"));
  });

  it("renders correctly and handles logout with no dismiss", () => {
    jest.spyOn(router, "canDismiss").mockReturnValue(false);
    const { getByTestId } = renderWithProviders(<MyPage />);

    fireEvent.press(getByTestId("logout"));
  });

  it("renders correctly and handles logout with dismiss", () => {
    jest.spyOn(router, "canDismiss").mockReturnValue(true);
    const { getByTestId } = renderWithProviders(<MyPage />);

    fireEvent.press(getByTestId("logout"));
  });

  it("handles logout fail", () => {
    jest.spyOn(AuthAPI, "logout").mockResolvedValue(null);
    const { getByTestId } = renderWithProviders(<MyPage />);

    fireEvent.press(getByTestId("logout"));
  });

  it("renders correctly when not logged in", () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      mode: "guest",
      selectedProfile: null,
    });
    renderWithProviders(<MyPage />);
  });

  it("renders correctly when logged in as pro and handles navigate", () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      mode: "pro",
      selectedProfile: sampleAuthor,
    });
    renderWithProviders(<MyPage />);
  });
});
