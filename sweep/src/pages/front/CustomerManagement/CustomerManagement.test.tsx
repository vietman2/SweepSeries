import { fireEvent, waitFor } from "@testing-library/react-native";

import { CustomerManagement } from "./CustomerManagement";
import * as FrontContext from "@contexts/front";
import * as LessonsAPI from "@services/calendar/lessons";
import * as StudentsAPI from "@services/products/students";
import { sampleLessonSimple } from "@testdata/calendar";
import { sampleStudents } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Profile", () => ({
  ProfileImage: () => <div />,
}));
jest.mock("@fragments/Schedule", () => ({
  ScheduleSimple: () => <div />,
}));

describe("<CustomerManagement />", () => {
  it("renders correctly", async () => {
    jest.spyOn(FrontContext, "useFront").mockReturnValue({
      uuid: "1",
      mode: "coach",
      coach: undefined,
      academies: [],
      headerImage: "",
      headerText: "",
      selectAcademy: jest.fn(),
      selectCoach: jest.fn(),
      refresh: jest.fn(),
    });
    jest
      .spyOn(LessonsAPI, "getDailyLessons")
      .mockResolvedValue([sampleLessonSimple]);
    jest.spyOn(StudentsAPI, "getStudents").mockResolvedValue(sampleStudents);

    const { getByTestId } = renderWithProviders(<CustomerManagement />);

    await waitFor(() => {
      fireEvent.press(getByTestId("refresh"));
      fireEvent.press(getByTestId("student-1"));
    });
  });

  it("handles api error correctly", async () => {
    jest.spyOn(FrontContext, "useFront").mockReturnValue({
      uuid: "1",
      mode: "academy",
      coach: undefined,
      academies: [],
      headerImage: "",
      headerText: "",
      selectAcademy: jest.fn(),
      selectCoach: jest.fn(),
      refresh: jest.fn(),
    });
    jest.spyOn(LessonsAPI, "getDailyLessons").mockResolvedValue(null);
    jest.spyOn(StudentsAPI, "getStudents").mockResolvedValue(null);

    waitFor(() => renderWithProviders(<CustomerManagement />));
  });
});
