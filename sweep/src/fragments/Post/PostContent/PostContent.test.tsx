import { fireEvent, waitFor } from "@testing-library/react-native";

import { PostContent } from "./PostContent";
import * as AuthContext from "@contexts/auth";
import * as AlertAPI from "@services/alert/alert";
import * as PostsAPI from "@services/community/posts";
import { samplePostDetail } from "@testdata/community";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("../Report/ReportModal", () => ({
  ReportModal: () => null,
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
jest.mock("@fragments/Author", () => ({
  AuthorProfile: () => null,
}));

describe("<PostContent />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      mode: "normal",
      isAuthenticated: true,
      selectedProfileId: 1,
    });
    jest
      .spyOn(AlertAPI, "alert")
      .mockImplementation(
        (title: string, message: string, onPress?: () => void) => {
          if (onPress) {
            onPress();
          }
        }
      );
  });

  it("renders correctly and enter edit mode", async () => {
    const { getByTestId, getByText } = await waitFor(() =>
      renderWithProviders(
        <PostContent
          post={{ ...samplePostDetail, is_author: true, is_liked: false }}
          refresh={jest.fn()}
        />
      )
    );

    fireEvent.press(getByTestId("수정하기"));
    fireEvent.press(getByText("취소"));
  });

  it("handles delete correctly", async () => {
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
      selectedProfileId: null,
    });
    const { getByTestId } = await waitFor(() =>
      renderWithProviders(
        <PostContent post={samplePostDetail} refresh={jest.fn()} />
      )
    );

    fireEvent.press(getByTestId("like"));
  });
});
