import { fireEvent, screen } from "@testing-library/react";
import * as Router from "react-router-dom";

import { RootLayout } from "./RootLayout";
import * as AuthContext from "@contexts/auth";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: jest.fn(),
}));
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
  });

  it("handles navigation", () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: true,
      logout: jest.fn(),
      setToken: jest.fn(),
      login: jest.fn(),
    });
    renderWithProviders(<RootLayout />);
    
    fireEvent.click(screen.getByText("회원 관리"));
  });

  it("handles not logged in", () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: false,
      logout: jest.fn(),
      setToken: jest.fn(),
      login: jest.fn(),
    });
    renderWithProviders(<RootLayout />);
  });
});
