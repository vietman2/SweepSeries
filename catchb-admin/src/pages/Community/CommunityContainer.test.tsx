import { CommunityContainer } from "./CommunityContainer";
import { renderWithProviders } from "@utils/test-utils";

describe("<CommunityContainer />", () => {
  it("renders without crashing", () => {
    renderWithProviders(<CommunityContainer />);
  });
});
