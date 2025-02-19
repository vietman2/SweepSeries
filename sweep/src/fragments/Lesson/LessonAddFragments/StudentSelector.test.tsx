import { fireEvent, waitFor } from "@testing-library/react-native";

import { StudentSelector } from "./StudentSelector";
import * as AddLessonContext from "@contexts/addlesson";
import * as PeopleAPI from "@services/auth/people";
import * as StudentsAPI from "@services/products/students";
import { sampleAcademyPrograms, sampleStudents } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<StudentSelector />", () => {
  const defaultContextWithProgram = {
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
  };

  beforeEach(() => {
    jest
      .spyOn(AddLessonContext, "useAddLesson")
      .mockReturnValue(defaultContextWithProgram);
  });

  it("renders nothing if selectedProgram is null", () => {
    jest
      .spyOn(AddLessonContext, "useAddLesson")
      .mockReturnValue({ ...defaultContextWithProgram, selectedProgram: null });
    renderWithProviders(<StudentSelector />);
  });

  it("handles unselect when selectedStudent is not null", async () => {
    jest.spyOn(AddLessonContext, "useAddLesson").mockReturnValue({
      ...defaultContextWithProgram,
      selectedStudent: {
        id: 1,
        name: "name",
        phone: "phone",
      },
    });
    const { getByTestId } = renderWithProviders(<StudentSelector />);

    await waitFor(() => {
      fireEvent.press(getByTestId("unselect-student"));
    });
  });

  it("handles select when selectedStudent is null", async () => {
    jest.spyOn(StudentsAPI, "getStudents").mockResolvedValue(sampleStudents);
    const { getByTestId } = renderWithProviders(<StudentSelector />);

    fireEvent.press(getByTestId("input"));

    await waitFor(() => {
      fireEvent.press(getByTestId("student-1"));
    });
  });

  it("handles api error", async () => {
    jest.spyOn(StudentsAPI, "getStudents").mockResolvedValue(null);
    const { getByTestId } = renderWithProviders(<StudentSelector />);

    fireEvent.press(getByTestId("input"));
  });

  it("handles search when selectedStudent is null", async () => {
    const { getByTestId } = renderWithProviders(<StudentSelector />);

    fireEvent.press(getByTestId("toggle-mode"));
    fireEvent.changeText(getByTestId("이름"), "name");
    fireEvent.changeText(getByTestId("전화번호"), "phone");

    jest.spyOn(PeopleAPI, "searchPerson").mockResolvedValueOnce("NOT_FOUND");
    await waitFor(() => {
      fireEvent.press(getByTestId("검색하기"));
    });

    jest.spyOn(PeopleAPI, "searchPerson").mockResolvedValueOnce(null);
    await waitFor(() => {
      fireEvent.press(getByTestId("검색하기"));
    });

    jest
      .spyOn(PeopleAPI, "searchPerson")
      .mockResolvedValueOnce(sampleStudents[0]);
    await waitFor(() => {
      fireEvent.press(getByTestId("검색하기"));
    });
  });
});
