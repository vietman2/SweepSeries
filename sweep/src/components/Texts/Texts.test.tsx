import { CalloutLarge, CalloutSmall, InputTitle } from "./Texts";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Texts");

describe("<CalloutLarge />", () => {
  it("should render without subtitle", () => {
    renderWithProviders(<CalloutLarge text="Title" />);
  });
});

describe("<CalloutSmall />", () => {
  it("should render default", () => {
    renderWithProviders(<CalloutSmall text="Title" />);
  });

  it("should render with color", () => {
    renderWithProviders(<CalloutSmall text="Title" color="black" />);
  });
});

describe("<InputTitle />", () => {
  it("should render without subtitle", () => {
    renderWithProviders(<InputTitle title="Title" />);
  });

  it("should render with subtitle", () => {
    renderWithProviders(<InputTitle title="Title" subtitle="Subtitle" />);
  });
});
