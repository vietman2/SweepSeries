import { waitFor } from "@testing-library/react-native";

import { NoticeEdit } from "./NoticeEdit";
import * as NoticesAPI from "@services/products/notices";
import { sampleNotices } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Notice", () => ({
  NoticeBlock: () => "NoticeBlock",
}));

describe("<NoticeEdit />", () => {
  it("renders without crashing", async () => {
    jest.spyOn(NoticesAPI, "getNotice").mockResolvedValue(sampleNotices[0]);
    renderWithProviders(<NoticeEdit />);

    await waitFor(() => expect("NoticeBlock").toBeTruthy());
  });

  it("renders handles api error", () => {
    jest.spyOn(NoticesAPI, "getNotice").mockResolvedValue(null);
    renderWithProviders(<NoticeEdit />);
  });
});
