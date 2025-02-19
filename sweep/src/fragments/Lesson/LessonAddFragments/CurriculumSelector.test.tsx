import { fireEvent, waitFor } from "@testing-library/react-native";

import { CurriculumSelector } from "./CurriculumSelector";
import * as AddLessonContext from "@contexts/addlesson";
import * as LessonsAPI from "@services/calendar/lessons";
import { sampleAcademyPrograms, sampleCurriculums } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Program", () => ({
  CurriculumChip: () => <div>CurriculumChip</div>,
}));

describe("<CurriculumSelector />", () => {
  const defaultContext = {
    selectedProgram: sampleAcademyPrograms[0],
    selectedStudent: {
      id: 1,
      name: "name",
      phone: "phone",
    },
    selectedCurriculum: null,
    selectedCoaches: [],
    selectedStartDateTime: new Date(),
    setProgram: jest.fn(),
    setStudent: jest.fn(),
    setStudentTemp: jest.fn(),
    setSelectedCurriculum: jest.fn(),
    addCoach: jest.fn(),
    setSelectedStartDateTime: jest.fn(),
    handleSubmit: jest.fn(),
  };
  const defaultCurriculumResponse = {
    curriculum: sampleCurriculums[0],
    remaining_lessons: 1,
  };

  beforeEach(() => {
    jest
      .spyOn(AddLessonContext, "useAddLesson")
      .mockReturnValue(defaultContext);
  });

  it("renders nothing if selectedProgram and selectedStudent is null", () => {
    jest.spyOn(AddLessonContext, "useAddLesson").mockReturnValue({
      ...defaultContext,
      selectedProgram: null,
      selectedStudent: null,
    });
    renderWithProviders(<CurriculumSelector />);
  });

  it("renders status 1", () => {
    jest
      .spyOn(AddLessonContext, "useAddLesson")
      .mockReturnValue({
        ...defaultContext,
        selectedCurriculum: sampleCurriculums[0],
      });
    jest
      .spyOn(LessonsAPI, "getCurriculum")
      .mockResolvedValue(defaultCurriculumResponse);
    waitFor(() => renderWithProviders(<CurriculumSelector />));
  });

  it("renders status 1 (no selected curriculum (error))", () => {
    jest
      .spyOn(LessonsAPI, "getCurriculum")
      .mockResolvedValue(defaultCurriculumResponse);
    waitFor(() => renderWithProviders(<CurriculumSelector />));
  });

  it("handles status 2", async () => {
    jest.spyOn(LessonsAPI, "getCurriculum").mockResolvedValue({
      ...defaultCurriculumResponse,
      remaining_lessons: 0,
    });
    const { getByTestId } = renderWithProviders(<CurriculumSelector />);

    await waitFor(() => fireEvent.press(getByTestId("curriculum-1")));
  });

  it("handles status 3 (case 1)", () => {
    jest.spyOn(LessonsAPI, "getCurriculum").mockResolvedValue({
      ...defaultCurriculumResponse,
      remaining_lessons: -1,
    });
    waitFor(() => renderWithProviders(<CurriculumSelector />));
  });

  it("handles status 3 (case 2)", () => {
    jest.spyOn(AddLessonContext, "useAddLesson").mockReturnValue({
      ...defaultContext,
      selectedStudent: { id: -1, name: "name", phone: "phone" },
    });
    waitFor(() => renderWithProviders(<CurriculumSelector />));
  });

  it("handles api error", () => {
    jest.spyOn(LessonsAPI, "getCurriculum").mockResolvedValue(null);
    waitFor(() => renderWithProviders(<CurriculumSelector />));
  });
});
