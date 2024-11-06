import { EmployeeManagement } from "./Employees";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Coach", () => ({
  CoachRequest: () => <div>CoachRequest</div>,
  CoachSimple: () => <div>CoachSimple</div>,
}));

describe("<EmployeeManagement />", () => {
  it("renders correctly", () => {
    renderWithProviders(<EmployeeManagement />);
  });
});
