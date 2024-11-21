import { screen, waitFor } from "@testing-library/react";

import App from "./App";
import * as AuthContext from "@contexts/auth";
import * as ThemeContext from "@contexts/theme";
import * as AuthAPI from "@services/auth/auth";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@contexts/auth", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
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
jest.mock("./_layout", () => ({
  RootLayout: () => <div>RootLayout</div>,
}));

describe("<App />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dark mode (auto login success)", async () => {
    jest.spyOn(AuthAPI, "refresh").mockResolvedValue({ access: "token" });
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
    });
    jest.spyOn(ThemeContext, "useTheme").mockReturnValue({
      isDarkMode: true,
      toggleTheme: jest.fn(),
    });

    renderWithProviders(<App />, {
      withRouter: false,
    });

    await waitFor(() => {
      expect(screen.getByText("RootLayout")).toBeInTheDocument();
    });
  });

  it("renders light mode (auto login fail)", async () => {
    jest.spyOn(AuthAPI, "refresh").mockResolvedValue(null);
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
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
      expect(screen.getByText("RootLayout")).toBeInTheDocument();
    });
  });
});
