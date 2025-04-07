import { FrontTopTabs } from "./FrontTopTabs";
import * as FrontContext from "@contexts/front";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./ProfileManagement/ProfileManagement", () => ({
  ProfileManagement: () => <div data-testid="ProfileManagement" />,
}));
jest.mock("./ProgramManagement/ProgramManagement", () => ({
  ProgramManagement: () => <div data-testid="ProgramManagement" />,
}));
jest.mock("./CustomerManagement/CustomerManagement", () => ({
  CustomerManagement: () => <div data-testid="CustomerManagement" />,
}));
jest.mock("./ReviewManagement/ReviewManagement", () => ({
  ReviewManagement: () => <div data-testid="ReviewManagement" />,
}));
jest.mock("./EmployeeManagement/EmployeeManagement", () => ({
  EmployeeManagement: () => <div data-testid="EmployeeManagement" />,
}));
jest.mock("./NoticeManagement/NoticeManagement", () => ({
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
