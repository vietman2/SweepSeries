import { fireEvent } from "@testing-library/react-native";

import { Login } from "./Login";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
}));

describe("<Login>", () => {
  it("renders correctly and handles button clicks", async () => {
    const { getByTestId } = renderWithProviders(<Login />);

    fireEvent.press(getByTestId("kakao-button"));
    fireEvent.press(getByTestId("naver-button"));
    fireEvent.press(getByTestId("비회원으로 둘러보기"));
  });
});
