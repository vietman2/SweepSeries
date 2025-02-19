import { fireEvent, waitFor } from "@testing-library/react-native";

import { ProgramSelector } from "./ProgramSelector";
import * as AddLessonContext from "@contexts/addlesson";
import * as ProgramsAPI from "@services/products/programs";
import { sampleAcademyPrograms } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Program", () => ({
  ProgramSimple: () => <div>ProgramSimple</div>,
}));

describe("<ProgramSelector />", () => {
  beforeEach(() => {
    jest
      .spyOn(ProgramsAPI, "getProgramsByProfile")
      .mockResolvedValue(sampleAcademyPrograms);
  });

  it("handles program select when selectedProgram is null", async () => {
    const { getByTestId } = renderWithProviders(<ProgramSelector />);

    await waitFor(() => {
      fireEvent.press(getByTestId("program-1"));
    });
  });

  it("handles api error", async () => {
    jest.spyOn(ProgramsAPI, "getProgramsByProfile").mockResolvedValue(null);
    renderWithProviders(<ProgramSelector />);
  });

  it("handles unselect when selectedProgram is not null", async () => {
    jest.spyOn(AddLessonContext, "useAddLesson").mockReturnValue({
      selectedProgram: sampleAcademyPrograms[0],
      selectedStudent: null,
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
    });
    const { getByTestId } = renderWithProviders(<ProgramSelector />);

    await waitFor(() => {
      fireEvent.press(getByTestId("program-1"));
    });
  });
});
