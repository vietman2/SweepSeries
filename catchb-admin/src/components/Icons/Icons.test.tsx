import { AppIcon } from "./AppIcon";
import { MainLogo } from "./Logo";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Icons");

describe("<AppIcon />", () => {
  it("should render all icons", () => {
    renderWithProviders(
      <>
        <AppIcon icon="dots" size={16} color="black" />
      </>
    );
  });

  it("should render null", () => {
    renderWithProviders(<AppIcon icon="invalid" size={16} color="black" />);
  });
});

describe("<MainLogo />", () => {
  it("renders correctly", () => {
    renderWithProviders(<MainLogo />);
  });
});
