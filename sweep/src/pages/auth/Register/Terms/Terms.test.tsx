import { fireEvent } from "@testing-library/react-native";

import { Terms } from "./Terms";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

describe("<Terms />", () => {
  it("renders and handles presses correctly", () => {
    const { getByTestId } = renderWithProviders(<Terms />);

    fireEvent.press(getByTestId("모두 동의 합니다."));
    fireEvent.press(getByTestId("모두 동의 합니다."));
    fireEvent.press(getByTestId("(필수) 만 14세 이상입니다."));
    fireEvent.press(getByTestId("(필수) Catch B 서비스 이용약관"));
    fireEvent.press(getByTestId("(필수) Catch B 개인정보 처리방침"));
    fireEvent.press(getByTestId("(선택) 광고성/경고 알림 수신 동의"));
    fireEvent.press(getByTestId("다음으로"));
  });
});
