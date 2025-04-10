import { PromodeProfile, SelectedProfile } from "./PromodeProfile";
import { renderWithProviders } from "@utils/test-utils";

describe("<PromodeProfile />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <>
        <PromodeProfile image="test-image" text="Test Text" />
        <PromodeProfile image="test-image" text="Test Text" selected />
      </>
    );
  });
});

describe("<SelectedProfile />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <SelectedProfile image="test-image" text="Test Text" />
    );
  });
});
