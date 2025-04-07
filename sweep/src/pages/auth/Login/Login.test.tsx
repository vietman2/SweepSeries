import { fireEvent, waitFor } from "@testing-library/react-native";

import { Login } from "./Login";
import * as AuthAPI from "@services/auth/auth";
import { renderWithProviders } from "@utils/test-utils";

describe("<Login>", () => {
  it("handles login", async () => {
    jest
      .spyOn(AuthAPI, "login")
      .mockResolvedValue({ user: { mode: "pro", profile: {} } });

    const { getByTestId } = renderWithProviders(<Login />);

    fireEvent.changeText(getByTestId("아이디"), "testuser");
    fireEvent.changeText(getByTestId("비밀번호"), "testuser");

    await waitFor(() => {
      fireEvent.press(getByTestId("로그인"));
    });
  });

  it("handles login fail", async () => {
    jest.spyOn(AuthAPI, "login").mockResolvedValue(null);

    const { getByTestId } = renderWithProviders(<Login />);

    await waitFor(() => {
      fireEvent.press(getByTestId("로그인"));
    });
  });

  it("handles back", () => {
    const { getByTestId } = renderWithProviders(<Login />);

    fireEvent.press(getByTestId("돌아가기"));
  });
});
