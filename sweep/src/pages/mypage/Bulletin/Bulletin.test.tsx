import { Bulletin } from "./Bulletin";
import { renderWithProviders } from "@utils/test-utils";

describe("<Bulletin />", () => {
  it("renders correctly", () => {
    renderWithProviders(<Bulletin />);
  });
});
