import { MainLogo } from "./Logo";
import { renderWithProviders } from "@utils/test-utils";

describe("<MainLogo />", () => {
  it("renders correctly", () => {
    renderWithProviders(<MainLogo />);
  });
});
