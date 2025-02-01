import { NoticeBlock } from "./NoticeBlock";
import { sampleNotices } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<NoticeBlock />", () => {
  it("renders notice block", () => {
    renderWithProviders(<NoticeBlock notice={sampleNotices[0]} />);
  });
});
