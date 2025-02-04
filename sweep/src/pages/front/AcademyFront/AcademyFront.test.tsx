import { AcademyFront } from "./AcademyFront";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./Profile/Profile", () => ({
  ProfileManagement: () => <div data-testid="profile-management" />,
}));
jest.mock("./Programs/Programs", () => ({
  ProgramManagement: () => <div data-testid="program-management" />,
}));
jest.mock("./Customers/Customers", () => ({
  CustomerManagement: () => <div data-testid="customer-management" />,
}));
jest.mock("./Reviews/Reviews", () => ({
  ReviewManagement: () => <div data-testid="review-management" />,
}));
jest.mock("./Employees/Employees", () => ({
  EmployeeManagement: () => <div data-testid="employee-management" />,
}));
jest.mock("./Notices/Notices", () => ({
  NoticeManagement: () => <div data-testid="notice-management" />,
}));

describe("<AcademyFront />", () => {
  it("renders correctly", () => {
    renderWithProviders(<AcademyFront />);
  });
});
