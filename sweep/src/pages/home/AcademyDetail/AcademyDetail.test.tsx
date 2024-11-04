import { AcademyDetail } from "./AcademyDetail";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./Information/Information", () => ({
  Information: () => "Information",
}));
jest.mock("./ProgramList/ProgramList", () => ({
  ProgramList: () => "ProgramList",
}));
jest.mock("@fragments/Academy", () => ({
  AcademyProfile: () => "AcademyProfile",
}));

describe("<AcademyDetail />", () => {
  it("renders correctly", () => {
    renderWithProviders(<AcademyDetail />);
  });
});
