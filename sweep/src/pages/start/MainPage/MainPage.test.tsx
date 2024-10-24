import { fireEvent } from "@testing-library/react-native";

import { MainPage } from "./MainPage";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}));

describe("<MainPage>", () => {
  it("renders correctly handles navigations", () => {
    const { getByTestId, getByText } = renderWithProviders(<MainPage />);

    fireEvent.press(getByText("일하러 가기"));
    fireEvent.press(getByTestId("로그인"));
    fireEvent.press(getByTestId("비회원으로 둘러보기"));
  });
});
