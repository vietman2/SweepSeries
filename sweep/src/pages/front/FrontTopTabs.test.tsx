import { FrontTopTabs } from "./FrontTopTabs";
import * as FrontContext from "@contexts/front";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./Profile/Profile", () => ({
  ProfileManagement: () => <div data-testid="ProfileManagement" />,
}));
jest.mock("./Programs/Programs", () => ({
  ProgramManagement: () => <div data-testid="ProgramManagement" />,
}));
jest.mock("./Customers/Customers", () => ({
  CustomerManagement: () => <div data-testid="CustomerManagement" />,
}));
jest.mock("./Reviews/Reviews", () => ({
  ReviewManagement: () => <div data-testid="ReviewManagement" />,
}));
jest.mock("./Employees/Employees", () => ({
  EmployeeManagement: () => <div data-testid="EmployeeManagement" />,
}));
jest.mock("./Notices/Notices", () => ({
  NoticeManagement: () => <div data-testid="NoticeManagement" />,
}));

describe("<FrontMain />", () => {
  const commonParams = {
    uuid: "1",
    academies: [],
    coach: undefined,
    headerImage: "",
    headerText: "",
    selectAcademy: jest.fn(),
    selectCoach: jest.fn(),
    refresh: jest.fn(),
  };

  it("renders null correctly", async () => {
    jest.spyOn(FrontContext, "useFront").mockReturnValue({
      ...commonParams,
      mode: null,
    });

    renderWithProviders(<FrontTopTabs />);
  });

  it("renders academy correctly", async () => {
    jest.spyOn(FrontContext, "useFront").mockReturnValue({
      ...commonParams,
      mode: "academy",
    });

    renderWithProviders(<FrontTopTabs />);
  });

  it("renders coach correctly", async () => {
    jest.spyOn(FrontContext, "useFront").mockReturnValue({
      ...commonParams,
      mode: "coach",
    });

    renderWithProviders(<FrontTopTabs />);
  });
});
