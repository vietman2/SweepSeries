import { CommunityContainer } from "./CommunityContainer";
import { renderWithProviders } from "@utils/test-utils";

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
