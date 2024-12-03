import { AppsContainer } from "./AppsContainer";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./Notices", () => ({
  NoticeDetail: () => <div>NoticeDetail</div>,
  NoticesLayout: () => <div>NoticesLayout</div>,
  NoticeWrite: () => <div>NoticeWrite</div>,
}));
jest.mock("./Terms", () => ({
  TermsCreate: () => <div>TermsCreate</div>,
  TermsDetail: () => <div>TermsDetail</div>,
  TermsLayout: () => <div>TermsLayout</div>,
}));

describe("<AppsContainer />", () => {
  it("renders without crashing", () => {
    renderWithProviders(<AppsContainer />);
  });
});
