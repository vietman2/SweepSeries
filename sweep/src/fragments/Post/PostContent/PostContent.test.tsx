import { fireEvent, waitFor } from "@testing-library/react-native";

import { PostContent } from "./PostContent";
import * as AlertAPI from "@services/alert/alert";
import { samplePostDetail } from "@testdata/community";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("../Report/ReportModal", () => ({
  ReportModal: () => null,
}));
jest.mock("../Tag/Tag", () => ({
  Tag: () => null,
}));

describe("<PostContent />", () => {
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

  it("renders correctly and enter edit mode", async () => {
    const { getByTestId, getByText } = await waitFor(() =>
      renderWithProviders(<PostContent post={samplePostDetail} />)
    );

    fireEvent.press(getByTestId("수정하기"));
    fireEvent.press(getByText("취소"));
  });

  it("handles delete correctly", async () => {
    const { getByTestId } = await waitFor(() =>
      renderWithProviders(<PostContent post={samplePostDetail} />)
    );

    fireEvent.press(getByTestId("삭제하기"));
  });

  it("handles report correctly", async () => {
    const { getByTestId } = await waitFor(() =>
      renderWithProviders(<PostContent post={samplePostDetail} />)
    );

    fireEvent.press(getByTestId("신고하기"));
  });
});
