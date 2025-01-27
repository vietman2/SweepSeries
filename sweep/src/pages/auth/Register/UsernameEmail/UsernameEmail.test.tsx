import { fireEvent, waitFor } from "@testing-library/react-native";

import { UsernameEmail } from "./UsernameEmail";
import * as AuthAPI from "@services/auth/register";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

describe("<UsernameEmail />", () => {
  it("renders and handles check correctly", () => {
    jest
      .spyOn(AuthAPI, "checkUsernameEmail")
      .mockResolvedValue({ status: 200, data: {} });
    const { getByTestId } = renderWithProviders(<UsernameEmail />);

    waitFor(() => {
      fireEvent.press(getByTestId("로그인 시 사용할 아이디를 입력해주세요."));
      fireEvent.press(getByTestId("이메일을 입력해주세요."));
      fireEvent.press(getByTestId("button"));
    });
  });

  it("handles bad request correctly", () => {
    jest
      .spyOn(AuthAPI, "checkUsernameEmail")
      .mockResolvedValue({ status: 400, data: { error: "bad request" } });
    const { getByTestId } = renderWithProviders(<UsernameEmail />);

    waitFor(() => fireEvent.press(getByTestId("button")));
  });
});
