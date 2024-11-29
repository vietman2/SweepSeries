import { CommunityContainer } from "./CommunityContainer";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./Reports", () => ({
  PostReportDetail: () => <div>PostReportDetail</div>,
  PostReportsLayout: () => <div>PostReportsLayout</div>,
  ReportsLayout: () => <div>ReportsLayout</div>,
}));
jest.mock("./Tags", () => ({
  TagDetail: () => <div>TagDetail</div>,
  TagsLayout: () => <div>TagsLayout</div>,
  TagWrite: () => <div>TagWrite</div>,
}));

describe("<CommunityContainer />", () => {
  it("renders without crashing", () => {
    renderWithProviders(<CommunityContainer />);
  });
});
