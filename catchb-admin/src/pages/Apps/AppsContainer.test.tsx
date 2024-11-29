import { AppsContainer } from "./AppsContainer";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./Terms", () => ({
  TermsLayout: () => <div>TermsLayout</div>,
}));

describe("<AppsContainer />", () => {
  it("renders without crashing", () => {
    renderWithProviders(<AppsContainer />);
  });
});
