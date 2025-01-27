import { fireEvent, waitFor } from "@testing-library/react-native";

import { PhoneNumber } from "./PhoneNumber";
import * as RegisterAPI from "@services/auth/register";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

describe("<PhoneNumber />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("handles phone number verification correctly", async () => {
    jest.spyOn(RegisterAPI, "requestCode").mockResolvedValue(true);
    jest.spyOn(RegisterAPI, "verifyCode").mockResolvedValue({
      status: 200,
      data: { error: "" },
    });

    const { getByTestId } = renderWithProviders(<PhoneNumber />);

    fireEvent.changeText(getByTestId("이름을 입력해주세요."), "테스트");
    fireEvent.changeText(
      getByTestId("휴대폰 번호를 입력해주세요."),
      "01012345678"
    );

    fireEvent.press(getByTestId("인증번호 받기"));

    await waitFor(() => {
      expect(getByTestId("재발송 (3:00)")).toBeTruthy();
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      fireEvent.changeText(getByTestId("인증번호를 입력해주세요."), "123456");
    });

    fireEvent.press(getByTestId("인증하기"));

    await waitFor(() => {
      fireEvent.press(getByTestId("button"));
    });
  });

  it("handles api errors", async () => {
    const { getByTestId } = renderWithProviders(<PhoneNumber />);

    jest.spyOn(RegisterAPI, "requestCode").mockResolvedValueOnce(null);
    await waitFor(() => fireEvent.press(getByTestId("인증번호 받기")));

    jest.spyOn(RegisterAPI, "requestCode").mockResolvedValueOnce(true);
    await waitFor(() => fireEvent.press(getByTestId("인증번호 받기")));

    jest.spyOn(RegisterAPI, "verifyCode").mockResolvedValue({
      status: 400,
      data: { error: "테스트 오류 발생" },
    });
    await waitFor(() => fireEvent.press(getByTestId("인증하기")));
  });
});
