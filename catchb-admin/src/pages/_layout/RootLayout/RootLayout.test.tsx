import { fireEvent, screen } from "@testing-library/react";
import * as Router from "react-router-dom";

import { RootLayout } from "./RootLayout";
import * as AuthContext from "@contexts/auth";
import * as AuthAPI from "@services/auth/auth";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@contexts/auth", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAuth: jest.fn(),
}));

describe("<RootLayout />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: "/home",
      state: {},
      key: "test",
      search: "",
      hash: "",
    });
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: true,
      logout: jest.fn(),
      login: jest.fn(),
    });
  });

  it("handles navigation", () => {
    renderWithProviders(<RootLayout />);
    
    fireEvent.click(screen.getByText("회원 관리"));
  });

  it("handles logout", () => {
    jest.spyOn(AuthAPI, "logout").mockResolvedValue(true);
    renderWithProviders(<RootLayout />);

    fireEvent.click(screen.getByText("로그아웃"));
  });

  it("handles logout fail", () => {
    jest.spyOn(AuthAPI, "logout").mockResolvedValue(null);
    renderWithProviders(<RootLayout />);

    fireEvent.click(screen.getByText("로그아웃"));
  });

  it("handles not logged in", () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: false,
      logout: jest.fn(),
      login: jest.fn(),
    });
    renderWithProviders(<RootLayout />);
  });
});
