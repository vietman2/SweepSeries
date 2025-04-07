import { fireEvent, waitFor } from "@testing-library/react-native";
import * as Router from "expo-router";

import { PostList } from "./PostList";
import * as AuthContext from "@contexts/auth";
import * as PostsAPI from "@services/community/posts";
import { sampleAuthor } from "@testdata/auth";
import { samplePosts, sampleTags } from "@testdata/community";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@contexts/auth", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useAuth: jest.fn(),
}));
jest.mock("@fragments/Post", () => ({
  PostSimple: () => null,
  Tag: () => null,
}));

describe("<PostList />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      mode: "pro",
      selectedProfile: sampleAuthor,
    });
    jest
      .spyOn(PostsAPI, "getPosts")
      .mockResolvedValue({ posts: samplePosts, tags: sampleTags });
  });

  it("handles fetch post error correctly", async () => {
    jest.spyOn(PostsAPI, "getPosts").mockResolvedValue(null);
    const { getByTestId } = renderWithProviders(<PostList mode="덕아웃" />);

    await waitFor(() => {
      fireEvent.press(getByTestId("error"));
    });
  });

  it("renders and handles tag press", async () => {
    jest.spyOn(Router, "useFocusEffect").mockImplementationOnce((cb) => cb());
    const { getByTestId } = await waitFor(() =>
      renderWithProviders(<PostList mode="덕아웃" />)
    );

    waitFor(() => {
      fireEvent.press(getByTestId("MLB"));
      fireEvent.press(getByTestId("MLB"));
    });
  });

  it("handles post press", async () => {
    const { getByTestId } = renderWithProviders(<PostList mode="덕아웃" />);

    await waitFor(() => {
      fireEvent.press(getByTestId("post-id-2"));
      fireEvent.press(getByTestId("pencil"));
    });
  });

  it("renders without being logged in", async () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      mode: "guest",
      selectedProfile: null,
    });
    const { getByTestId } = renderWithProviders(<PostList mode="덕아웃" />);

    await waitFor(() => {
      fireEvent.press(getByTestId("post-id-2"));
    });
  });
});
