import { fireEvent, screen, waitFor } from "@testing-library/react";

import { Login } from "./Login";
import * as AuthContext from "@contexts/auth";
import * as AuthAPI from "@services/auth/auth";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@contexts/auth", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useAuth: jest.fn(),
}));

describe("<Login />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });
  });

  it("renders and handles login correctly", () => {
    jest.spyOn(AuthAPI, "login").mockResolvedValue({
      access: "token",
    });
    renderWithProviders(<Login />);

    waitFor(() => fireEvent.click(screen.getByText("로그인")));
  });

  it("renders and handles login fail correctly with enter key", async () => {
    jest.spyOn(AuthAPI, "login").mockResolvedValue(null);
    renderWithProviders(<Login />);

    await waitFor(() => {
      fireEvent.keyDown(window, { key: "A", code: "KeyA" });
      fireEvent.keyDown(window, { key: "Enter", code: "Enter" });
    });
  });

  it("handles navigate to home (auto login)", () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
    });
    renderWithProviders(<Login />);
  });
});
