import { MainLogo } from "./Logo";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Icons");

describe("<MainLogo />", () => {
  it("renders correctly", () => {
    renderWithProviders(<MainLogo />);
  });
});
