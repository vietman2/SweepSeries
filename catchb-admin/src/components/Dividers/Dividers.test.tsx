import { Divider } from "./Divider";
import { VerticalDivider } from "./VerticalDivider";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Dividers");

describe("<Divider />", () => {
  it("renders correctly", () => {
    renderWithProviders(<Divider />);
  });
  
  it("renders correctly with options", () => {
    renderWithProviders(<Divider bold color="black" />);
  });
});

describe("<VerticalDivider />", () => {
  it("renders correctly", () => {
    renderWithProviders(<VerticalDivider />);
  });
  
  it("renders correctly with options", () => {
    renderWithProviders(<VerticalDivider bold height="50%" />);
  });
});
