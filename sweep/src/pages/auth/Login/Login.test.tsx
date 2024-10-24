import { fireEvent } from "@testing-library/react-native";

import { Login } from "./Login";
import { renderWithProviders } from "@utils/test-utils";

describe("<Login>", () => {
  it("renders correctly and handles button clicks", async () => {
    const { getByTestId } = renderWithProviders(<Login />);

    fireEvent.press(getByTestId("kakao-button"));
    fireEvent.press(getByTestId("naver-button"));
    fireEvent.press(getByTestId("find-username"));
    fireEvent.press(getByTestId("find-password"));
  });
});
