import { MyAcademy } from "./MyAcademy";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Academy", () => ({
  AcademyCard: () => null,
}));

describe("<MyAcademy />", () => {
  it("should render correctly (month < 10)", () => {
    jest.spyOn(Date.prototype, "getFullYear").mockReturnValue(2024);
    jest.spyOn(Date.prototype, "getMonth").mockReturnValue(1);

    renderWithProviders(<MyAcademy />);
  });

  it("should render correctly (month >= 10)", () => {
    jest.spyOn(Date.prototype, "getFullYear").mockReturnValue(2024);
    jest.spyOn(Date.prototype, "getMonth").mockReturnValue(11);

    renderWithProviders(<MyAcademy />);
  });
});
