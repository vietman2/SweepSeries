import { AddLesson } from "./AddLesson";
import * as AuthContext from "@contexts/auth";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Lesson", () => ({
  ProgramSelector: () => <div data-testid="ProgramSelector" />,
  StudentSelector: () => <div data-testid="StudentSelector" />,
  CurriculumSelector: () => <div data-testid="CurriculumSelector" />,
  OtherFields: () => <div data-testid="OtherFields" />,
}));

describe("<AddLesson />", () => {
  it("renders all selectors", () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      mode: "pro",
      login: jest.fn(),
      logout: jest.fn(),
      selectedProfile: null,
    });
    renderWithProviders(<AddLesson />);
  });

  it("renders nothing if mode is not pro", () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      mode: "normal",
      login: jest.fn(),
      logout: jest.fn(),
      selectedProfile: null,
    });
    renderWithProviders(<AddLesson />);
  });
});
