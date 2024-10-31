import { fireEvent } from "@testing-library/react-native";

import { Recomment } from "./Recomment";
import * as AuthContext from "@contexts/auth";
import * as AlertAPI from "@services/alert/alert";
import { sampleRecomments } from "@testdata/community";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("../Report/ReportModal", () => ({
  ReportModal: () => null,
}));
jest.mock("@contexts/auth", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAuth: jest.fn(),
}));

describe("<Recomment />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      mode: "normal",
      isAuthenticated: true,
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

  it("renders correctly and handles edit mode", () => {
    const { getByTestId } = renderWithProviders(
      <Recomment recomment={sampleRecomments[0]} refresh={jest.fn()} />
    );

    fireEvent.press(getByTestId("수정하기"));
    fireEvent.press(getByTestId("close"));
  });

  it("handles report", () => {
    const { getByTestId } = renderWithProviders(
      <Recomment recomment={sampleRecomments[0]} refresh={jest.fn()} />
    );

    fireEvent.press(getByTestId("신고하기"));
  });

  it("handles delete", () => {
    const { getByTestId } = renderWithProviders(
      <Recomment recomment={sampleRecomments[0]} refresh={jest.fn()} />
    );

    fireEvent.press(getByTestId("삭제하기"));
  });
});
