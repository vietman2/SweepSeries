import { fireEvent } from "@testing-library/react-native";

import { Recomment } from "./Recomment";
import * as AlertAPI from "@services/alert/alert";
import { sampleRecomments } from "@testdata/community";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("../Report/ReportModal", () => ({
  ReportModal: () => null,
}));

describe("<Recomment />", () => {
  beforeEach(() => {
    jest
      .spyOn(AlertAPI, "alert")
      .mockImplementation(
        (title: string, message: string, onPress?: () => void) => {
          onPress && onPress();
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
