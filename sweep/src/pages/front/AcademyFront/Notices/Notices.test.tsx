import { fireEvent, waitFor } from "@testing-library/react-native";

import { NoticeManagement } from "./Notices";
import * as NoticesAPI from "@services/products/notices";
import { renderWithProviders } from "@utils/test-utils";
import { sampleNotices } from "@testdata/products";

jest.mock("@fragments/Notice", () => ({
  NoticeSimple: () => <div data-testid="notice-simple" />,
}));

describe("<NoticeManagement />", () => {
  it("renders notices and handle create", async () => {
    jest.spyOn(NoticesAPI, "getNotices").mockResolvedValue(sampleNotices);
    jest.spyOn(NoticesAPI, "createNotice").mockResolvedValue(true);
    const { getByTestId } = renderWithProviders(<NoticeManagement uuid="1" />);

    await waitFor(() => {
      fireEvent.press(getByTestId("open"));
      fireEvent.press(getByTestId("hide"));
      fireEvent.press(getByTestId("open"));
      fireEvent.press(getByTestId("저장"));
    });
  });

  it("handles bad api responses", async () => {
    jest.spyOn(NoticesAPI, "getNotices").mockResolvedValue(null);
    jest.spyOn(NoticesAPI, "createNotice").mockResolvedValue(null);
    const { getByTestId } = renderWithProviders(<NoticeManagement uuid="1" />);

    await waitFor(() => {
      fireEvent.press(getByTestId("open"));
      fireEvent.press(getByTestId("저장"));
    });
  });
});
