import { fireEvent } from "@testing-library/react-native";

import { CalendarButtons } from "./CalendarButtons";
import * as AuthContext from "@contexts/auth";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));
jest.mock("@contexts/auth", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAuth: jest.fn(),
}));

describe("<CalendarButtons />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      mode: "normal",
      isAuthenticated: true,
    });
  });

  it("renders normal mode correctly and handles buttons", () => {
    const { getByTestId } = renderWithProviders(
      <CalendarButtons open setOpen={jest.fn()} />
    );

    fireEvent.press(getByTestId("addtodo"));
    fireEvent.press(getByTestId("addschedule"));
  });

  it("renders pro mode correctly and handles buttons", () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      mode: "pro",
      isAuthenticated: true,
    });

    const { getByTestId } = renderWithProviders(
      <CalendarButtons open setOpen={jest.fn()} />
    );

    fireEvent.press(getByTestId("requests"));
  });

  it("renders closed correctly", () => {
    const { getByTestId } = renderWithProviders(
      <CalendarButtons open={false} setOpen={jest.fn()} />
    );

    fireEvent.press(getByTestId("open"));
  });
});
