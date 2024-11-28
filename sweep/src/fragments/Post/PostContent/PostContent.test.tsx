import { fireEvent, waitFor } from "@testing-library/react-native";

import { PostContent } from "./PostContent";
import * as AuthContext from "@contexts/auth";
import * as PostsAPI from "@services/community/posts";
import { sampleAuthor } from "@testdata/auth";
import { samplePostDetail } from "@testdata/community";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));
jest.mock("../Tag/Tag", () => ({
  Tag: () => null,
}));
jest.mock("@contexts/auth", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAuth: jest.fn(),
}));

describe("<PostContent />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      mode: "normal",
      isAuthenticated: true,
      selectedProfile: sampleAuthor,
    });
  });

  it("renders and handles edit correctly", async () => {
    jest.spyOn(PostsAPI, "editPost").mockResolvedValueOnce(true);
    const { getByTestId, getByText } = await waitFor(() =>
      renderWithProviders(
        <PostContent
          post={{ ...samplePostDetail, is_author: true, is_liked: false }}
          refresh={jest.fn()}
        />
      )
    );

    waitFor(() => {
      fireEvent.press(getByTestId("수정하기"));
      fireEvent.press(getByText("취소"));
      fireEvent.press(getByTestId("수정하기"));
      fireEvent.press(getByText("수정"));
    });
  });

  it("handles fail", async () => {
    jest.spyOn(PostsAPI, "editPost").mockResolvedValueOnce(null);
    const { getByTestId, getByText } = await waitFor(() =>
      renderWithProviders(
        <PostContent
          post={{ ...samplePostDetail, is_author: true, is_liked: false }}
          refresh={jest.fn()}
        />
      )
    );

    waitFor(() => {
      fireEvent.press(getByTestId("수정하기"));
      fireEvent.press(getByText("수정"));
    });
  });

  it("handles delete correctly", async () => {
    jest.spyOn(PostsAPI, "deletePost").mockResolvedValueOnce(true);
    const { getByTestId } = await waitFor(() =>
      renderWithProviders(
        <PostContent
          post={{ ...samplePostDetail, is_author: true }}
          refresh={jest.fn()}
        />
      )
    );

    fireEvent.press(getByTestId("삭제하기"));
  });

  it("handles delete fail", async () => {
    jest.spyOn(PostsAPI, "deletePost").mockResolvedValueOnce(null);
    const { getByTestId } = await waitFor(() =>
      renderWithProviders(
        <PostContent
          post={{ ...samplePostDetail, is_author: true }}
          refresh={jest.fn()}
        />
      )
    );

    fireEvent.press(getByTestId("삭제하기"));
  });

  it("handles report correctly", async () => {
    const { getByTestId } = await waitFor(() =>
      renderWithProviders(
        <PostContent post={samplePostDetail} refresh={jest.fn()} />
      )
    );

    fireEvent.press(getByTestId("신고하기"));
  });

  it("handles like correctly", async () => {
    jest.spyOn(PostsAPI, "likePost").mockResolvedValueOnce(true);
    const { getByTestId } = await waitFor(() =>
      renderWithProviders(
        <PostContent post={samplePostDetail} refresh={jest.fn()} />
      )
    );

    fireEvent.press(getByTestId("like"));
  });

  it("handles like fail correctly", async () => {
    jest.spyOn(PostsAPI, "likePost").mockResolvedValueOnce(null);
    const { getByTestId } = await waitFor(() =>
      renderWithProviders(
        <PostContent post={samplePostDetail} refresh={jest.fn()} />
      )
    );

    fireEvent.press(getByTestId("like"));
  });

  it("handles not logged in", async () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      mode: "guest",
      isAuthenticated: false,
      selectedProfile: null,
    });
    const { getByTestId } = await waitFor(() =>
      renderWithProviders(
        <PostContent post={samplePostDetail} refresh={jest.fn()} />
      )
    );

    fireEvent.press(getByTestId("like"));
  });
});
