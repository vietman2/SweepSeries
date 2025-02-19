import { TouchableOpacity, View } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { AddLessonProvider, useAddLesson } from "./AddLessonContext";
import * as LessonsAPI from "@services/calendar/lessons";
import {
  sampleAcademyPrograms,
  sampleCoaches,
  sampleCurriculums,
  sampleStudents,
} from "@testdata/products";

jest.unmock("@contexts/addlesson");
jest.mock("expo-router", () => ({
  router: { back: jest.fn() },
}));

const TestComponent = () => {
  const {
    setProgram,
    setStudent,
    setSelectedCurriculum,
    setSelectedStartDateTime,
    setStudentTemp,
    addCoach,
    handleSubmit,
  } = useAddLesson();

  return (
    <View>
      <TouchableOpacity
        onPress={() => setProgram(sampleAcademyPrograms[0])}
        testID="setProgram"
      />
      <TouchableOpacity
        onPress={() => setProgram(null)}
        testID="setProgramReset"
      />
      <TouchableOpacity
        onPress={() => setStudent(sampleStudents[0])}
        testID="setStudent"
      />
      <TouchableOpacity
        onPress={() => setStudent(null)}
        testID="setStudentReset"
      />
      <TouchableOpacity
        onPress={() => setStudentTemp("name", "phone")}
        testID="setStudentTemp"
      />
      <TouchableOpacity
        onPress={() => setSelectedCurriculum(sampleCurriculums[0])}
        testID="setSelectedCurriculum"
      />
      <TouchableOpacity
        onPress={() => setSelectedStartDateTime(new Date())}
        testID="setSelectedStartDateTime"
      />
      <TouchableOpacity
        onPress={() => addCoach(sampleCoaches[0])}
        testID="addCoach"
      />
      <TouchableOpacity onPress={handleSubmit} testID="handleSubmit" />
    </View>
  );
};

describe("<AddLessonProvider />", () => {
  it("handles submit", async () => {
    const { getByTestId } = render(
      <AddLessonProvider>
        <TestComponent />
      </AddLessonProvider>
    );

    fireEvent.press(getByTestId("setProgramReset"));
    fireEvent.press(getByTestId("setStudentReset"));
    fireEvent.press(getByTestId("handleSubmit")); // no selected coaches

    fireEvent.press(getByTestId("addCoach")); // add coach
    fireEvent.press(getByTestId("addCoach")); // remove coach
    fireEvent.press(getByTestId("addCoach")); // re-add coach
    fireEvent.press(getByTestId("handleSubmit")); // no selected student

    fireEvent.press(getByTestId("setStudent"));
    fireEvent.press(getByTestId("handleSubmit")); // no selected program

    fireEvent.press(getByTestId("setProgram"));
    fireEvent.press(getByTestId("handleSubmit")); // no selected curriculum

    fireEvent.press(getByTestId("setSelectedCurriculum"));
    fireEvent.press(getByTestId("setSelectedStartDateTime"));
    fireEvent.press(getByTestId("setStudentTemp"));

    jest.spyOn(LessonsAPI, "createLesson").mockResolvedValueOnce(null);
    await waitFor(() => {
      fireEvent.press(getByTestId("handleSubmit"));
    });

    jest.spyOn(LessonsAPI, "createLesson").mockResolvedValueOnce({ id: "1" });
    await waitFor(() => {
      fireEvent.press(getByTestId("handleSubmit"));
    });
  });

  it("handles misuse", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow();
  });
});
