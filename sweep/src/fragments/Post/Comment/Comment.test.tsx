import { fireEvent, waitFor } from "@testing-library/react-native";

import { Comment } from "./Comment";
import * as AuthContext from "@contexts/auth";
import * as CommentsAPI from "@services/community/comments";
import * as ReCommentsAPI from "@services/community/recomments";
import { sampleAuthor } from "@testdata/auth";
import { sampleComments } from "@testdata/community";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./Recomment", () => ({
  Recomment: () => null,
}));
jest.mock("@contexts/auth", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAuth: jest.fn(),
}));

describe("<Comment />", () => {
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

  const report = () => {
    const { getByTestId } = renderWithProviders(
      <Comment
        comment={{ ...sampleComments[0], is_author: false }}
        recommentMode
        enterRecomment={jest.fn()}
        refresh={jest.fn()}
      />
    );

    waitFor(() => {
      fireEvent.press(getByTestId("신고하기"));
      fireEvent.press(getByTestId("report"));
    });
  };

  it("handles report", () => {
    jest.spyOn(CommentsAPI, "reportComment").mockResolvedValue(true);

    report();
  });

  it("handles report", () => {
    jest.spyOn(CommentsAPI, "reportComment").mockResolvedValue(null);

    report();
  });

  it("handles recomment write, edit and comment delete", () => {
    jest.spyOn(CommentsAPI, "deleteComment").mockResolvedValue(true);
    jest.spyOn(CommentsAPI, "editComment").mockResolvedValue(true);
    jest.spyOn(ReCommentsAPI, "createRecomment").mockResolvedValue(true);
    const { getByTestId } = renderWithProviders(
      <Comment
        comment={sampleComments[0]}
        recommentMode
        enterRecomment={jest.fn()}
        refresh={jest.fn()}
      />
    );

    waitFor(() => {
      fireEvent.press(getByTestId("recomment"));
      fireEvent.press(getByTestId("send"));
      fireEvent.press(getByTestId("수정하기"));
      fireEvent.press(getByTestId("patch"));
      fireEvent.press(getByTestId("삭제하기"));
    });
  });

  it("handles recomment write, edit and comment delete fail", () => {
    jest.spyOn(CommentsAPI, "deleteComment").mockResolvedValue(null);
    jest.spyOn(CommentsAPI, "editComment").mockResolvedValue(null);
    jest.spyOn(ReCommentsAPI, "createRecomment").mockResolvedValue(null);
    const { getByTestId } = renderWithProviders(
      <Comment
        comment={sampleComments[0]}
        recommentMode
        enterRecomment={jest.fn()}
        refresh={jest.fn()}
      />
    );

    waitFor(() => {
      fireEvent.press(getByTestId("recomment"));
      fireEvent.press(getByTestId("send"));
      fireEvent.press(getByTestId("수정하기"));
      fireEvent.press(getByTestId("close"));
      fireEvent.press(getByTestId("수정하기"));
      fireEvent.press(getByTestId("patch"));
      fireEvent.press(getByTestId("삭제하기"));
    });
  });

  it("handles comment like", () => {
    jest.spyOn(CommentsAPI, "likeComment").mockResolvedValue(true);
    const { getByTestId } = renderWithProviders(
      <Comment
        comment={sampleComments[0]}
        recommentMode={false}
        enterRecomment={jest.fn()}
        refresh={jest.fn()}
      />
    );

    fireEvent.press(getByTestId("like"));
  });

  it("handles like fail", () => {
    jest.spyOn(CommentsAPI, "likeComment").mockResolvedValue(null);
    const { getByTestId } = renderWithProviders(
      <Comment
        comment={sampleComments[0]}
        recommentMode={false}
        enterRecomment={jest.fn()}
        refresh={jest.fn()}
      />
    );

    fireEvent.press(getByTestId("like"));
  });

  it("handles unauthorized", () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      mode: "guest",
      isAuthenticated: false,
      selectedProfile: null,
    });
    const { getByTestId } = renderWithProviders(
      <Comment
        comment={sampleComments[1]}
        recommentMode={false}
        enterRecomment={jest.fn()}
        refresh={jest.fn()}
        first
      />
    );

    waitFor(() => {
      fireEvent.press(getByTestId("like"));
    });
  });
});
