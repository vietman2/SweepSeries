import { LoadingComponent } from "./Loading";
import { LoginNeeded } from "./LoginNeeded";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Fallbacks");

describe("<LoadingComponent>", () => {
  it("renders correctly", () => {
    renderWithProviders(<LoadingComponent />);
  });
});

describe("<LoginNeeded>", () => {
  it("renders correctly", () => {
    renderWithProviders(<LoginNeeded />);
  });
});
