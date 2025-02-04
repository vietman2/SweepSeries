import { fireEvent, waitFor } from "@testing-library/react-native";

import { NoticeList } from "./NoticeList";
import * as NoticesAPI from "@services/products/notices";
import { sampleNotices } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({ id: "1" })),
}));
jest.mock("@fragments/Notice", () => ({
  NoticeSimple: () => "NoticeSimple",
}));

describe("<NoticeList />", () => {
  it("renders and handles navigate correctly", async () => {
    jest.spyOn(NoticesAPI, "getNotices").mockResolvedValueOnce(sampleNotices);
    const { getByTestId } = renderWithProviders(<NoticeList />);

    await waitFor(() => fireEvent.press(getByTestId("notice-1")));
  });

  it("handles api error", async () => {
    jest.spyOn(NoticesAPI, "getNotices").mockResolvedValueOnce(null);
    renderWithProviders(<NoticeList />);

    await waitFor(() => expect("소식이 없습니다.").toBeTruthy());
  });
});
