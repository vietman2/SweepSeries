import { fireEvent, waitFor } from "@testing-library/react-native";

import { Recomment } from "./Recomment";
import * as AuthContext from "@contexts/auth";
import * as RecommentsAPI from "@services/community/recomments";
import { sampleAuthor } from "@testdata/auth";
import { sampleRecomments } from "@testdata/community";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("../Report/ReportModal", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");
  return {
    ReportModal: ({
      onSubmit,
    }: {
      onSubmit: (selectedReason: string, detail: string) => void;
    }) => (
      <TouchableOpacity
        testID="report"
        onPress={() => onSubmit("inappropriate", "inappropriate")}
      />
    ),
  };
});
jest.mock("@contexts/auth", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAuth: jest.fn(),
}));
jest.mock("@fragments/Author", () => ({
  AuthorProfile: () => null,
}));

describe("<Recomment />", () => {
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

  it("renders correctly and handles edit mode", () => {
    const { getByTestId } = renderWithProviders(
      <Recomment recomment={sampleRecomments[0]} refresh={jest.fn()} />
    );
  });

  it("handles report", () => {
    const { getByTestId } = renderWithProviders(
      <Recomment
        recomment={{ ...sampleRecomments[0], is_author: false }}
        refresh={jest.fn()}
      />
    );

    waitFor(() => {
      fireEvent.press(getByTestId("신고하기"));
      fireEvent.press(getByTestId("report"));
    });
  });

  it("handles like and delete", () => {
    jest.spyOn(RecommentsAPI, "likeRecomment").mockResolvedValueOnce(true);
    jest.spyOn(RecommentsAPI, "editRecomment").mockResolvedValueOnce(true);
    jest.spyOn(RecommentsAPI, "deleteRecomment").mockResolvedValueOnce(true);
    const { getByTestId } = renderWithProviders(
      <Recomment recomment={sampleRecomments[0]} refresh={jest.fn()} />
    );

    waitFor(() => {
      fireEvent.press(getByTestId("like"));
      fireEvent.press(getByTestId("삭제하기"));
      fireEvent.press(getByTestId("수정하기"));
      fireEvent.press(getByTestId("patch"));
    });
  });

  it("handles like and delete fail", () => {
    jest.spyOn(RecommentsAPI, "likeRecomment").mockResolvedValueOnce(null);
    jest.spyOn(RecommentsAPI, "editRecomment").mockResolvedValueOnce(null);
    jest.spyOn(RecommentsAPI, "deleteRecomment").mockResolvedValueOnce(null);
    const { getByTestId } = renderWithProviders(
      <Recomment recomment={sampleRecomments[0]} refresh={jest.fn()} />
    );

    waitFor(() => {
      fireEvent.press(getByTestId("like"));
      fireEvent.press(getByTestId("삭제하기"));
      fireEvent.press(getByTestId("수정하기"));
      fireEvent.press(getByTestId("close"));
      fireEvent.press(getByTestId("수정하기"));
      fireEvent.press(getByTestId("patch"));
    });
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
      <Recomment recomment={sampleRecomments[1]} refresh={jest.fn()} first />
    );

    fireEvent.press(getByTestId("like"));
  });
});
