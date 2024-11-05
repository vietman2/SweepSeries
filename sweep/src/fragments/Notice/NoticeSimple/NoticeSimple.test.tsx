import { NoticeSimple } from "./NoticeSimple";
import { sampleNotices } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<NoticeSimple />", () => {
  it("renders correctly", () => {
    renderWithProviders(<NoticeSimple notice={sampleNotices[0]} />);
  });
});
