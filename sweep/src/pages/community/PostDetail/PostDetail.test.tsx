import { fireEvent, waitFor } from "@testing-library/react-native";
import * as Router from "expo-router";

import { PostDetail } from "./PostDetail";
import * as AuthContext from "@contexts/auth";
import * as PostsAPI from "@services/community/posts";
import { samplePostDetail } from "@testdata/community";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@contexts/auth", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useAuth: jest.fn(),
}));
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
  beforeEach(() => {
    jest
      .spyOn(Router, "useLocalSearchParams")
      .mockReturnValue({ date: "2021-07-02" });
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      mode: "pro",
      selectedProfileId: 1,
    });
    jest.spyOn(PostsAPI, "getPostDetail").mockResolvedValue(samplePostDetail);
  });

  it("handles bad response", async () => {
    jest.spyOn(PostsAPI, "getPostDetail").mockResolvedValue(null);

    const { getByTestId } = renderWithProviders(<PostDetail />);

    await waitFor(() => fireEvent.press(getByTestId("error")));
  });

  it("renders and handles refresh", async () => {
    const { getByTestId } = renderWithProviders(<PostDetail />);

    await waitFor(() => fireEvent.press(getByTestId("refresh")));
  });

  it("handles post with no comment", async () => {
    jest
      .spyOn(PostsAPI, "getPostDetail")
      .mockResolvedValue({ ...samplePostDetail, comments: [] });
    const { getByTestId } = renderWithProviders(<PostDetail />);

    await waitFor(() => fireEvent.press(getByTestId("refresh")));
  });

  it("handles recomment mode", async () => {
    const { getByTestId } = renderWithProviders(<PostDetail />);

    await waitFor(() => {
      fireEvent.press(getByTestId("recomment"));
      fireEvent.press(getByTestId("cancel"));
    });
  });

  it("handles guest mode", async () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      mode: "guest",
      selectedProfileId: null,
    });
    const { getByTestId } = renderWithProviders(<PostDetail />);

    await waitFor(() => {
      fireEvent.press(getByTestId("recomment"));
      fireEvent.press(getByTestId("cancel"));
    });
  });
});
