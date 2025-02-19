import { Platform } from "react-native";
import { fireEvent, waitFor } from "@testing-library/react-native";

import { OtherFields } from "./OtherFields";
import * as AddLessonContext from "@contexts/addlesson";
import * as CoachesAPI from "@services/products/coach";
import {
  sampleAcademyPrograms,
  sampleCoaches,
  sampleCurriculums,
} from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");

  RN.Platform.OS = "ios";

  return RN;
});
jest.mock("@fragments/Coach", () => ({
  CoachSelect: () => <div>CoachSelect</div>,
}));
jest.mock("@fragments/Schedule", () => ({
  DateTimeHeaderDisabled: () => <div>DateTimeHeaderDisabled</div>,
}));

describe("<OtherFields />", () => {
  const defaultContext = {
    selectedProgram: sampleAcademyPrograms[0],
    selectedStudent: {
      id: 1,
      name: "name",
      phone: "phone",
    },
    selectedCurriculum: sampleCurriculums[0],
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
      .mockReturnValue(defaultContext);
    jest
      .spyOn(CoachesAPI, "getCoachesByProfile")
      .mockResolvedValue(sampleCoaches);
  });

  it("should render nothing if no program is selected", async () => {
    jest
      .spyOn(AddLessonContext, "useAddLesson")
      .mockReturnValue({ ...defaultContext, selectedProgram: null });
    waitFor(() => renderWithProviders(<OtherFields />));
  });

  it("should handle all fields", async () => {
    const { getByTestId } = renderWithProviders(<OtherFields />);

    await waitFor(() => {
      fireEvent.press(getByTestId("coach-1")); // select coach
      fireEvent.press(getByTestId("change-datetime")); // select datetime
      fireEvent.press(getByTestId("cancel")); // cancel datetime
      fireEvent.press(getByTestId("등록하기")); // submit
    });
  });

  it("should render android and handles api error", async () => {
    Platform.OS = "android";
    jest.spyOn(CoachesAPI, "getCoachesByProfile").mockResolvedValue(null);
    waitFor(() => renderWithProviders(<OtherFields />));
  });
});
