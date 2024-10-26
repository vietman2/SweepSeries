import { fireEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import { ErrorPage } from "./ErrorPage";
import { LoadingComponent } from "./Loading";
import { LoginNeeded } from "./LoginNeeded";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    canDismiss: jest.fn(),
    dismissAll: jest.fn(),
    replace: jest.fn(),
  },
}));
jest.unmock("@components/Fallbacks");

describe("<ErrorPage>", () => {
  it("renders and handles refresh correctly", () => {
    const { getByTestId } = renderWithProviders(<ErrorPage onRefresh={jest.fn()} />);

    fireEvent.press(getByTestId("refresh"));
  });
});

describe("<LoadingComponent>", () => {
  it("renders correctly", () => {
    renderWithProviders(<LoadingComponent />);
  });
});

describe("<LoginNeeded>", () => {
  it("renders correctly and handles redirect (dismissAll)", () => {
    jest.spyOn(router, "canDismiss").mockReturnValue(true);
    const { getByTestId } = renderWithProviders(<LoginNeeded />);

    fireEvent.press(getByTestId("로그인 하러가기"));
  });

  it("renders correctly and handles redirect (nothing to dismiss)", () => {
    jest.spyOn(router, "canDismiss").mockReturnValue(false);
    const { getByTestId } = renderWithProviders(<LoginNeeded />);

    fireEvent.press(getByTestId("로그인 하러가기"));
  });
});
