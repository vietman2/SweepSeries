import { fireEvent, waitFor } from "@testing-library/react-native";

import { CustomerDetail } from "./CustomerDetail";
import * as FrontContext from "@contexts/front";
import * as StudentsAPI from "@services/products/students";
import { sampleStudentLesson } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Lesson", () => ({
  LessonSimple: () => null,
}));

describe("<CustomerDetail />", () => {
  beforeEach(() => {
    jest.spyOn(FrontContext, "useFront").mockReturnValue({
      mode: "academy",
      uuid: "1",
      academies: [],
      coach: undefined,
      headerImage: "",
      headerText: "",
      selectAcademy: jest.fn(),
      selectCoach: jest.fn(),
      refresh: jest.fn(),
    });
  });

  it("handles academy mode correctly", async () => {
    jest
      .spyOn(StudentsAPI, "getAcademyStudentDetail")
      .mockResolvedValue(sampleStudentLesson);

    const { getByTestId } = renderWithProviders(<CustomerDetail />);

    await waitFor(() => {
      fireEvent.press(getByTestId("lesson-1"));
    });
  });

  it("handles api error", async () => {
    jest.spyOn(StudentsAPI, "getAcademyStudentDetail").mockResolvedValue(null);

    waitFor(() => renderWithProviders(<CustomerDetail />));
  });
});
