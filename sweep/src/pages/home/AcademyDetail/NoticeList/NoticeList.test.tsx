import { NoticeList } from "./NoticeList";
import * as NoticesAPI from "@services/products/notices";
import { sampleNotices } from "@testdata/products";
import { waitFor } from "@testing-library/react-native";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Notice", () => ({
  NoticeSimple: () => "NoticeSimple",
}));

describe("<NoticeList />", () => {
  it("renders correctly", async () => {
    jest.spyOn(NoticesAPI, "getNotices").mockResolvedValueOnce(sampleNotices);
    renderWithProviders(<NoticeList />);

    await waitFor(() => expect("NoticeSimple").toBeTruthy());
  });
  
  it("handles api error", async () => {
    jest.spyOn(NoticesAPI, "getNotices").mockResolvedValueOnce(null);
    renderWithProviders(<NoticeList />);

    await waitFor(() => expect("소식이 없습니다.").toBeTruthy());
  });
});
