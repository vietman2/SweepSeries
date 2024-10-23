import { Divider, VerticalDivider } from "./Divider";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Dividers");

describe("<Divider>", () => {
  it("renders correctly", () => {
    renderWithProviders(<Divider />);
  });

  it("renders bold divider", () => {
    renderWithProviders(<Divider bold />);
  });

  it("renders divider with custom color", () => {
    renderWithProviders(<Divider color="red" />);
  });
});

describe("<VerticalDivider>", () => {
  it("renders correctly", () => {
    renderWithProviders(<VerticalDivider width={1} />);
  });

  it("renders divider with custom color", () => {
    renderWithProviders(<VerticalDivider width={1} color="red" />);
  });
});
