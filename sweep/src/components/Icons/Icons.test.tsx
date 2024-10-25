import { AppIcon } from "./AppIcon";
import { MainLogo, HorizontalLogo } from "./Logo";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Icons");

describe("<AppIcon />", () => {
  it("renders correctly", () => {
    renderWithProviders(<AppIcon icon="home" color="black" size={24} />);
  });

  it("renders default size correctly", () => {
    renderWithProviders(<AppIcon icon="home" color="black" />);
  });
});

describe("<MainLogo />", () => {
  it("renders correctly", () => {
    renderWithProviders(<MainLogo />);
  });
});

describe("<HorizontalLogo />", () => {
  it("renders correctly", () => {
    renderWithProviders(<HorizontalLogo />);
  });
});
