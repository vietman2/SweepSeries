import { ProfileManagement } from "./Profile";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Academy", () => ({
  AcademyProfile: () => <div>AcademyProfile</div>,
  Facilities: () => <div>Facilities</div>,
  Introduction: () => <div>Introduction</div>,
  WorkingHours: () => <div>WorkingHours</div>,
}));

describe("<ProfileManagement />", () => {
  it("renders correctly", () => {
    renderWithProviders(<ProfileManagement />);
  });
});
