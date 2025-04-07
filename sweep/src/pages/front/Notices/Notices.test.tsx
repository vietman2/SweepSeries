import { fireEvent, waitFor } from "@testing-library/react-native";
import * as IPicker from "expo-image-picker";

import { NoticeManagement } from "./Notices";
import * as NoticesAPI from "@services/products/notices";
import { sampleNotices } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Notice", () => ({
  NoticeSimple: () => <div data-testid="notice-simple" />,
}));

describe("<NoticeManagement />", () => {
  const mockImage = {
    uri: "uri",
    width: 100,
    height: 100,
  };

  it("renders notices and handle create", async () => {
    jest.spyOn(IPicker, "launchImageLibraryAsync").mockResolvedValue({
      canceled: false,
      assets: [mockImage],
    });
    jest.spyOn(NoticesAPI, "getNotices").mockResolvedValue(sampleNotices);
    jest.spyOn(NoticesAPI, "createNotice").mockResolvedValue(true);
    const { getByTestId } = renderWithProviders(<NoticeManagement />);

    await waitFor(() => {
      fireEvent.press(getByTestId("open"));
      fireEvent.press(getByTestId("hide"));
      fireEvent.press(getByTestId("open"));
      fireEvent.press(getByTestId("이벤트"));
      fireEvent.press(getByTestId("image-upload"));
      fireEvent.press(getByTestId("notice-1"));
      fireEvent.press(getByTestId("저장"));
    });
  });

  it("handles bad api responses and image upload cancel", async () => {
    jest.spyOn(IPicker, "launchImageLibraryAsync").mockResolvedValue({
      canceled: true,
      assets: null,
    });
    jest.spyOn(NoticesAPI, "getNotices").mockResolvedValue(null);
    jest.spyOn(NoticesAPI, "createNotice").mockResolvedValue(null);
    const { getByTestId } = renderWithProviders(<NoticeManagement />);

    await waitFor(() => {
      fireEvent.press(getByTestId("image-upload"));
      fireEvent.press(getByTestId("open"));
      fireEvent.press(getByTestId("저장"));
    });
  });
});
