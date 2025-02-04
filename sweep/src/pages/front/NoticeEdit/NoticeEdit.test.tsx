import { fireEvent, waitFor } from "@testing-library/react-native";

import { NoticeEdit } from "./NoticeEdit";
import * as NoticesAPI from "@services/products/notices";
import { sampleNotices } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
  useLocalSearchParams: jest.fn().mockReturnValue({ id: "1", academyId: "1" }),
}));
jest.mock("@fragments/Notice", () => ({
  NoticeBlock: () => "NoticeBlock",
}));

describe("<NoticeEdit />", () => {
  it("handles edit and delete", async () => {
    jest.spyOn(NoticesAPI, "getNotice").mockResolvedValue(sampleNotices[0]);
    jest.spyOn(NoticesAPI, "editNotice").mockResolvedValue(sampleNotices[0]);
    jest.spyOn(NoticesAPI, "deleteNotice").mockResolvedValue(true);
    const { getByTestId } = renderWithProviders(<NoticeEdit />);

    await waitFor(() => {
      fireEvent.press(getByTestId("delete-button"));
      fireEvent.press(getByTestId("edit-button"));
      fireEvent.press(getByTestId("취소"));
      fireEvent.press(getByTestId("edit-button"));
      fireEvent.press(getByTestId("저장"));
    });
  });
  it("handles edit and delete fail", async () => {
    jest.spyOn(NoticesAPI, "getNotice").mockResolvedValue(sampleNotices[0]);
    jest.spyOn(NoticesAPI, "editNotice").mockResolvedValue(null);
    jest.spyOn(NoticesAPI, "deleteNotice").mockResolvedValue(null);
    const { getByTestId } = renderWithProviders(<NoticeEdit />);

    await waitFor(() => {
      fireEvent.press(getByTestId("delete-button"));
      fireEvent.press(getByTestId("edit-button"));
      fireEvent.press(getByTestId("저장"));
    });
  });

  it("renders handles api error", () => {
    jest.spyOn(NoticesAPI, "getNotice").mockResolvedValue(null);
    renderWithProviders(<NoticeEdit />);
  });
});
