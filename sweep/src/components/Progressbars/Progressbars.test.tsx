import { Progressbar } from "./Progressbar";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: "LinearGradient",
}));
jest.unmock("@components/Progressbars");

describe("<Progressbar />", () => {
  it("renders correctly", () => {
    renderWithProviders(<Progressbar done={5} total={10} />);
  });

  it("handles total 0 correctly", () => {
    renderWithProviders(<Progressbar done={0} total={0} />);
  });
});
