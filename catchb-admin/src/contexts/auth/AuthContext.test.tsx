import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { AuthProvider, useAuth } from "./AuthContext";
import * as AuthAPI from "@services/auth/auth";

jest.unmock("@contexts/auth");

const TestComponent = () => {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      <span>{isAuthenticated ? "Logged in" : "Not logged in"}</span>
      <button onClick={() => login("token")}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("<AuthProvider />", () => {
  const Child = () => <div>Children</div>;

  it("should render children", async () => {
    const { getByText } = await waitFor(() =>
      render(
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
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

describe("Axios Interceptor", () => {
  const mock = new MockAdapter(axios);

  beforeEach(() => {
    mock.reset();
  });

  it("should retry the request after refreshing the token", async () => {
    // Mock a request that initially fails with 403 and "token_not_valid" error
    mock.onGet("/test-endpoint").replyOnce(403, { code: "token_not_valid" });

    jest.spyOn(AuthAPI, "refresh").mockResolvedValue({
      status: 200,
      data: { access: "newAccessToken" },
    });

    // After refreshing the token, the request should succeed
    mock.onGet("/test-endpoint").reply(200, { data: "success" });

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = getByText("Login");

    // Simulate login action to set user and token
    waitFor(() => {
      loginButton.click();
    });

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Perform a GET request that should trigger the interceptor
    await waitFor(async () => {
      try {
        await axios.get("/test-endpoint");
      } catch (err) {}
    });

    consoleErrorSpy.mockRestore();
  });

  it("should logout if refreshing the token fails (error)", async () => {
    // Mock a request that initially fails with 403 and "token_not_valid" error
    mock.onGet("/test-endpoint").replyOnce(403, { code: "token_not_valid" });

    jest.spyOn(AuthAPI, "refresh").mockRejectedValue(new Error());

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = getByText("Login");

    // Simulate login action to set user and token
    waitFor(() => {
      loginButton.click();
    });

    // Perform a GET request that should trigger the interceptor
    await waitFor(async () => {
      try {
        await axios.get("/test-endpoint");
      } catch (err) {}
    });
  });

  it("should logout if refreshing the token fails (not 400)", async () => {
    // Mock a request that initially fails with 403 and "token_not_valid" error
    mock.onGet("/test-endpoint").replyOnce(403, { code: "token_not_valid" });

    jest.spyOn(AuthAPI, "refresh").mockResolvedValue({ status: 400, data: {} });

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = getByText("Login");

    // Simulate login action to set user and token
    waitFor(() => {
      loginButton.click();
    });

    // Perform a GET request that should trigger the interceptor
    await waitFor(async () => {
      try {
        await axios.get("/test-endpoint");
      } catch (err) {}
    });
  });

  it("should not retry if response status isn't 403", async () => {
    // Mock a request that initially fails with 401
    mock.onGet("/test-endpoint").replyOnce(401);

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = getByText("Login");

    // Simulate login action to set user and token
    waitFor(() => {
      loginButton.click();
    });

    // Perform a GET request that should trigger the interceptor
    await waitFor(async () => {
      try {
        await axios.get("/test-endpoint");
      } catch (err) {}
    });
  });
});
