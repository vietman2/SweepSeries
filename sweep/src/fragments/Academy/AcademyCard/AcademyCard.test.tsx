import { MyAcademy } from "./AcademyCard";
import { renderWithProviders } from "@utils/test-utils";

describe("<MyAcademy />", () => {
  it("renders correctly", () => {
    renderWithProviders(<MyAcademy />);
  });
});
