import { fireEvent } from "@testing-library/react-native";

import { Extras } from "./Extras";
import * as RegisterAPI from "@services/auth/register";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    dismissAll: jest.fn(),
    replace: jest.fn(),
  },
}));

describe("<Extras />", () => {
  it("handles extra information correctly", () => {
    jest.spyOn(RegisterAPI, "register").mockResolvedValue(true);

    const { getByTestId } = renderWithProviders(<Extras />);

    fireEvent.changeText(getByTestId("닉네임을 입력해주세요."), "nickname");
    fireEvent.changeText(
      getByTestId("생년월일을 입력해주세요. (YYYYMMDD)"),
      "2020-01-01"
    );
    fireEvent.press(getByTestId("남성"));

    fireEvent.press(getByTestId("button"));
  });

  it("handles register fail", () => {
    jest.spyOn(RegisterAPI, "register").mockResolvedValue(null);

    const { getByTestId } = renderWithProviders(<Extras />);

    fireEvent.press(getByTestId("button"));
  });
});
