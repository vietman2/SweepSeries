import { fireEvent } from "@testing-library/react-native";

import { PostDetail } from "./PostDetail";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Post", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");
  return {
    Comment: ({ enterRecomment }: { enterRecomment: () => void }) => {
      return <TouchableOpacity testID="recomment" onPress={enterRecomment} />;
    },
    PostContent: () => null,
  };
});

describe("<PostDetail />", () => {
  it("renders and handles refresh", () => {
    const { getByTestId } = renderWithProviders(<PostDetail />);

    fireEvent.press(getByTestId("refresh"));
  });

  it("handles recomment mode", () => {
    const { getByTestId } = renderWithProviders(<PostDetail />);

    fireEvent.press(getByTestId("recomment"));
    fireEvent.press(getByTestId("cancel"));
  });
});
