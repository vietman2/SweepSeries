import { fireEvent, waitFor } from "@testing-library/react-native";

import { Password } from "./Password";
import * as AuthAPI from "@services/auth/register";
import { renderWithProviders } from "@utils/test-utils";

describe("<Password />", () => {
  it("renders and handles checks correctly", () => {
    jest
      .spyOn(AuthAPI, "checkPassword")
      .mockResolvedValue({ status: 200, data: {} });
    const { getByTestId } = renderWithProviders(<Password />);

    waitFor(() => {
      fireEvent.press(getByTestId("비밀번호를 입력해주세요."));
      fireEvent.press(getByTestId("비밀번호를 다시 한 번 입력해주세요."));
      fireEvent.press(getByTestId("button"));
    });
  });

  it("handles bad request correctly", () => {
    jest
      .spyOn(AuthAPI, "checkPassword")
      .mockResolvedValue({ status: 400, data: { error: "bad request" } });
    const { getByTestId } = renderWithProviders(<Password />);

    waitFor(() => fireEvent.press(getByTestId("button")));
  });
});
