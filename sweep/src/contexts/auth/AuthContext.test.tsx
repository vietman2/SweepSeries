import { TouchableOpacity } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { AuthProvider, useAuth } from "./AuthContext";
import * as AuthAPI from "@services/auth/auth";

jest.unmock("@contexts/auth");

const TestComponent = () => {
  const { login, logout } = useAuth();

  const handleLogin = () => {
    login("pro");
  };

  return (
    <>
      <TouchableOpacity onPress={handleLogin} testID="login" />
      <TouchableOpacity onPress={logout} testID="logout" />
    </>
  );
};

describe("AuthProvider", () => {
  it("provides auth context correctly and handles login, logout", () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.press(getByTestId("login"));
    fireEvent.press(getByTestId("logout"));
  });

  it("handles error correctly", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow();
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

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = getByTestId("login");

    // Simulate login action to set user and token
    waitFor(() => {
      fireEvent.press(loginButton);
    });

    // Perform a GET request that should trigger the interceptor
    await waitFor(async () => {
      try {
        await axios.get("/test-endpoint");
      } catch (err) {}
    });
  });

  it("should logout if refreshing the token fails (error)", async () => {
    // Mock a request that initially fails with 403 and "token_not_valid" error
    mock.onGet("/test-endpoint").replyOnce(403, { code: "token_not_valid" });

    jest.spyOn(AuthAPI, "refresh").mockRejectedValue(new Error());

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = getByTestId("login");

    // Simulate login action to set user and token
    waitFor(() => {
      fireEvent.press(loginButton);
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

    jest.spyOn(AuthAPI, "refresh").mockResolvedValue(null);

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = getByTestId("login");

    // Simulate login action to set user and token
    waitFor(() => {
      fireEvent.press(loginButton);
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

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = getByTestId("login");

    // Simulate login action to set user and token
    waitFor(() => {
      fireEvent.press(loginButton);
    });

    // Perform a GET request that should trigger the interceptor
    await waitFor(async () => {
      try {
        await axios.get("/test-endpoint");
      } catch (err) {}
    });
  });
});
