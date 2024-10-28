import { MyAcademy } from "./MyAcademy";
import { renderWithProviders } from "@utils/test-utils";

describe("<MyAcademy />", () => {
  it("renders correctly", () => {
    renderWithProviders(<MyAcademy />);
  });
});
