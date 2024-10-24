import { TouchableOpacity } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import { AuthProvider, useAuth } from "./AuthContext";

jest.unmock("@contexts/auth");

const TestComponent = () => {
  const { login, logout } = useAuth();

  return (
    <>
      <TouchableOpacity onPress={login} testID="login" />
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
