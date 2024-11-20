import { screen, waitFor } from "@testing-library/react";

import App from "./App";
import * as AuthContext from "@contexts/auth";
import * as ThemeContext from "@contexts/theme";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@contexts/auth", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAuth: jest.fn(),
}));
jest.mock("@contexts/theme", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useTheme: jest.fn(),
}));
jest.mock("@pages/Login", () => ({
  Login: () => <div>Login</div>,
}));

describe("<App />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders logged in (dark mode)", async () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: true,
      logout: jest.fn(),
      setToken: jest.fn(),
      login: jest.fn(),
    });
    jest.spyOn(ThemeContext, "useTheme").mockReturnValue({
      isDarkMode: true,
      toggleTheme: jest.fn(),
    });

    waitFor(() =>
      renderWithProviders(<App />, {
        withRouter: false,
      })
    );

    await waitFor(() => {
      expect(screen.getByText("ComingSoon")).toBeInTheDocument();
    });
  });

  it("renders without being logged in (light mode)", async () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: false,
      logout: jest.fn(),
      setToken: jest.fn(),
      login: jest.fn(),
    });
    jest.spyOn(ThemeContext, "useTheme").mockReturnValue({
      isDarkMode: false,
      toggleTheme: jest.fn(),
    });

    waitFor(() =>
      renderWithProviders(<App />, {
        withRouter: false,
      })
    );

    await waitFor(() => {
      expect(screen.getByText("Login")).toBeInTheDocument();
    });
  });
});
