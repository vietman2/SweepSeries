import { InputTitle } from "./Texts";
import { renderWithProviders } from "@utils/test-utils";

describe("<InputTitle />", () => {
  it("should render without subtitle", () => {
    renderWithProviders(<InputTitle title="Title" />);
  });

  it("should render with subtitle", () => {
    renderWithProviders(<InputTitle title="Title" subtitle="Subtitle" />);
  });
});
