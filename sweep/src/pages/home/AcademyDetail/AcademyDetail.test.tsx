import { AcademyDetail } from "./AcademyDetail";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./CoachList/CoachList", () => ({
  CoachList: () => "CoachList",
}));
jest.mock("./Information/Information", () => ({
  Information: () => "Information",
}));
jest.mock("./NoticeList/NoticeList", () => ({
  NoticeList: () => "NoticeList",
}));
jest.mock("./ProgramList/ProgramList", () => ({
  ProgramList: () => "ProgramList",
}));
jest.mock("./ReviewList/ReviewList", () => ({
  ReviewList: () => "ReviewList",
}));
jest.mock("@fragments/Academy", () => ({
  AcademyProfile: () => "AcademyProfile",
}));

describe("<AcademyDetail />", () => {
  it("renders correctly", () => {
    renderWithProviders(<AcademyDetail />);
  });
});
