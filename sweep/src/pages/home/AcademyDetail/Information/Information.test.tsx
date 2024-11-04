import { Information } from "./Information";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Academy", () => ({
  Introduction: () => "Introduction",
  WorkingHours: () => "WorkingHours",
  Facilities: () => "Facilities",
}));

describe("<Information />", () => {
  it("renders all sections", () => {
    renderWithProviders(<Information />);
  });
});
