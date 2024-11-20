import { MemoryRouter, Routes, Route } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { AuthProvider, useAuth } from "./AuthContext";

jest.unmock("@contexts/auth");

const TestComponent = () => {
  const { isAuthenticated, login, setToken, logout } = useAuth();

  return (
    <div>
      <span>{isAuthenticated ? "Logged in" : "Not logged in"}</span>
      <button onClick={() => login()}>Login</button>
      <button onClick={() => setToken("token")}>Set Token</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("<AuthProvider />", () => {
  const Child = () => <div>Children</div>;

  it("should render children", async () => {
    const { getByText } = await waitFor(() =>
      render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route
              path="/"
              element={
                <AuthProvider>
                  <Child />
                </AuthProvider>
              }
            ></Route>
          </Routes>
        </MemoryRouter>
      )
    );
    expect(getByText("Children")).toBeInTheDocument();
  });

  it("should allow login", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText("Login");

    // Simulate login action
    fireEvent.click(loginButton);

    expect(screen.getByText("Logged in")).toBeInTheDocument();
  });

  it("should allow setting the token", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const setTokenButton = screen.getByText("Set Token");

    // Simulate setting token action
    fireEvent.click(setTokenButton);

    expect(screen.getByText("Not logged in")).toBeInTheDocument();
  });

  it("should allow logout", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const logoutButton = screen.getByText("Logout");

    // Simulate logout action
    fireEvent.click(logoutButton);

    expect(screen.getByText("Not logged in")).toBeInTheDocument();
  });

  it("should throw an error when useAuth is used outside of AuthProvider without logging the error", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    const InvalidComponent = () => {
      useAuth();
      return null;
    };

    // Expect error to be thrown
    expect(() => render(<InvalidComponent />)).toThrow(
      "useAuth must be used within an AuthProvider"
    );

    // Restore console.error
    spy.mockRestore();
  });
});
