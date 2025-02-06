import { Platform } from "react-native";
import { fireEvent, waitFor } from "@testing-library/react-native";

import { AddLesson } from "./AddLesson";
import * as AuthContext from "@contexts/auth";
import * as LessonsAPI from "@services/calendar/lessons";
import * as CoachesAPI from "@services/products/coach";
import * as ProgramsAPI from "@services/products/programs";
import * as StudentsAPI from "@services/products/students";
import { sampleAuthor } from "@testdata/auth";
import {
  sampleAcademyPrograms,
  sampleCoaches,
  sampleStudents,
} from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");

  RN.Platform.OS = "ios";

  return RN;
});
jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));
jest.mock("@fragments/Coach", () => ({
  CoachSelect: () => <div>CoachSelect</div>,
}));
jest.mock("@fragments/Program", () => ({
  ProgramSimple: () => <div>ProgramSimple</div>,
}));
jest.mock("@fragments/Schedule", () => ({
  DateTimeHeaderDisabled: () => <div>DateTimeHeaderDisabled</div>,
}));

describe("<AddLesson />", () => {
  beforeEach(() => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      mode: "pro",
      selectedProfile: sampleAuthor,
    });
    jest
      .spyOn(CoachesAPI, "getCoachesByProfile")
      .mockResolvedValue(sampleCoaches);
    jest
      .spyOn(ProgramsAPI, "getProgramsByProfile")
      .mockResolvedValue(sampleAcademyPrograms);
  });

  it("handles new student mode correctly", async () => {
    const { getByTestId } = renderWithProviders(<AddLesson />);

    await waitFor(() => {
      fireEvent.press(getByTestId("program-1")); // select program
      fireEvent.press(getByTestId("program-1")); // unselect program
      fireEvent.press(getByTestId("program-1")); // reselect program

      fireEvent.press(getByTestId("등록하기")); // submit without selecting coaches

      fireEvent.press(getByTestId("coach-1")); // select coach
      fireEvent.press(getByTestId("coach-1")); // unselect coach
      fireEvent.press(getByTestId("coach-1")); // reselect coach

      fireEvent.press(getByTestId("toggle-mode")); // toggle mode
      fireEvent.press(getByTestId("cancel"));
      fireEvent.press(getByTestId("등록하기")); // submit without inputting info

      fireEvent.changeText(getByTestId("이름"), "Name");
      fireEvent.changeText(getByTestId("전화번호"), "010-1234-5678");
    });

    jest.spyOn(LessonsAPI, "createLesson").mockResolvedValueOnce(null);
    fireEvent.press(getByTestId("등록하기")); // submit fail

    jest.spyOn(LessonsAPI, "createLesson").mockResolvedValueOnce({});
    fireEvent.press(getByTestId("등록하기")); // submit success
  });

  it("handles existing student mode correctly", async () => {
    jest.spyOn(StudentsAPI, "getStudents").mockResolvedValue(sampleStudents);
    Platform.OS = "android";

    const { getByTestId } = renderWithProviders(<AddLesson />);

    await waitFor(() => {
      fireEvent.press(getByTestId("program-2")); // select program
      fireEvent.press(getByTestId("coach-2")); // select coach
    });

    fireEvent.press(getByTestId("input")); // search student

    await waitFor(() => {
      fireEvent.press(getByTestId("student-1")); // select student
      fireEvent.press(getByTestId("unselect-student")); // unselect student

      fireEvent.press(getByTestId("등록하기")); // submit without selecting student
    });

    fireEvent.press(getByTestId("input")); // search student

    await waitFor(() => {
      fireEvent.press(getByTestId("student-1")); // reselect student
      fireEvent.press(getByTestId("change-datetime")); // select datetime
    });

    jest.spyOn(LessonsAPI, "createLesson").mockResolvedValue(null);
    fireEvent.press(getByTestId("등록하기")); // submit fail

    jest.spyOn(LessonsAPI, "createLesson").mockResolvedValue({});
    fireEvent.press(getByTestId("등록하기")); // submit success
  });

  it("handles no selected profile in context", async () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      mode: "pro",
      selectedProfile: null,
    });

    const { getByTestId } = renderWithProviders(<AddLesson />);

    await waitFor(() => {
      fireEvent.press(getByTestId("program-1")); // submit
    });
  });

  it("handles config error (not pro mode)", () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      mode: "normal",
      selectedProfile: null,
    });

    waitFor(() => renderWithProviders(<AddLesson />));
  });

  it("handles api error 1 (student api)", async () => {
    jest.spyOn(StudentsAPI, "getStudents").mockResolvedValue(null);

    const { getByTestId } = renderWithProviders(<AddLesson />);

    await waitFor(() => {
      fireEvent.press(getByTestId("program-2")); // select program
      fireEvent.press(getByTestId("input"));
    });
  });

  it("handles api error 2 (program api)", async () => {
    jest.spyOn(ProgramsAPI, "getProgramsByProfile").mockResolvedValue(null);

    renderWithProviders(<AddLesson />);
  });
});
