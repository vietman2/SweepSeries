import { fireEvent } from "@testing-library/react-native";

import { PostList } from "./PostList";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));
jest.mock("@fragments/Post", () => ({
  PostSimple: () => null,
  Tag: () => null,
}));

describe("<PostList />", () => {
  it("renders and handles tag press", () => {
    const { getByTestId } = renderWithProviders(<PostList mode="덕아웃" />);

    fireEvent.press(getByTestId("MLB"));
    fireEvent.press(getByTestId("MLB"));
  });

  it("handles post press", () => {
    const { getByTestId } = renderWithProviders(<PostList mode="덕아웃" />);

    fireEvent.press(getByTestId("post-id-2"));
  });

  it("handles search", () => {
    const { getByTestId } = renderWithProviders(<PostList mode="덕아웃" />);

    fireEvent.press(getByTestId("search"));
  });
});
