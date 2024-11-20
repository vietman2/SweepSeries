import { screen, waitFor } from "@testing-library/react";

import App from "./App";
import * as ThemeContext from "@contexts/theme";
import { renderWithProviders } from "@utils/test-utils";

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

  it("renders dark mode", async () => {
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
      expect(screen.getByText("RootLayout")).toBeInTheDocument();
    });
  });

  it("renders light mode", async () => {
    jest.spyOn(ThemeContext, "useTheme").mockReturnValue({
      isDarkMode: false,
      toggleTheme: jest.fn(),
    });

    await waitFor(() =>
      renderWithProviders(<App />, {
        withRouter: false,
      })
    );
  });
});
