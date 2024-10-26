import { fireEvent } from "@testing-library/react-native";

import { Comment } from "./Comment";
import * as AlertAPI from "@services/alert/alert";
import { sampleComments } from "@testdata/community";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./Recomment", () => ({
  Recomment: () => null,
}));
jest.mock("../Report/ReportModal", () => ({
  ReportModal: () => null,
}));

describe("<Comment />", () => {
  beforeEach(() => {
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

  it("renders and handles edit mode", () => {
    const { getByTestId } = renderWithProviders(
      <Comment
        comment={sampleComments[0]}
        recommentMode={false}
        enterRecomment={jest.fn()}
        refresh={jest.fn()}
      />
    );

    fireEvent.press(getByTestId("수정하기"));
    fireEvent.press(getByTestId("close"));
  });

  it("handles report", () => {
    const { getByTestId } = renderWithProviders(
      <Comment
        comment={sampleComments[0]}
        recommentMode
        enterRecomment={jest.fn()}
        refresh={jest.fn()}
      />
    );

    fireEvent.press(getByTestId("신고하기"));
  });

  it("handles delete", () => {
    const { getByTestId } = renderWithProviders(
      <Comment
        comment={sampleComments[0]}
        recommentMode
        enterRecomment={jest.fn()}
        refresh={jest.fn()}
      />
    );

    fireEvent.press(getByTestId("삭제하기"));
  });

  it("handles recomment write", () => {
    const { getByTestId } = renderWithProviders(
      <Comment
        comment={sampleComments[0]}
        recommentMode
        enterRecomment={jest.fn()}
        refresh={jest.fn()}
      />
    );

    fireEvent.press(getByTestId("recomment"));
  });
});
