import { fireEvent, waitFor } from "@testing-library/react-native";
import * as Router from "expo-router";

import { LessonDetail } from "./LessonDetail";
import * as SessionsAPI from "@services/calendar/sessions";
import { sampleLesson } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Lesson", () => ({
  LessonSimple: () => <div>LessonSimple</div>,
}));

describe("<LessonDetail />", () => {
  beforeEach(() => {
    jest
      .spyOn(Router, "useLocalSearchParams")
      .mockReturnValue({ id: "1", mode: "normal" });
    jest
      .spyOn(SessionsAPI, "getSessionDetails")
      .mockResolvedValue(sampleLesson);
  });

  it("should handle notes submit", async () => {
    const { getByTestId } = renderWithProviders(<LessonDetail />);

    jest.spyOn(SessionsAPI, "updateSessionNotes").mockResolvedValue(null);
    
    await waitFor(() => {
      fireEvent.changeText(getByTestId("notes-input"), "notes");
      fireEvent.press(getByTestId("저장"));
    });

    jest.spyOn(SessionsAPI, "updateSessionNotes").mockResolvedValue(true);

    await waitFor(() => {
      fireEvent.press(getByTestId("저장"));
    });
  });

  it("should handle feedback submit", async () => {
    jest
      .spyOn(Router, "useLocalSearchParams")
      .mockReturnValue({ id: "1", mode: "pro" });

    const { getByTestId } = renderWithProviders(<LessonDetail />);

    jest
      .spyOn(SessionsAPI, "updateSessionFeedback")
      .mockResolvedValueOnce(null);

    await waitFor(() => {
      fireEvent.changeText(getByTestId("feedback-input"), "feedback");
      fireEvent.press(getByTestId("저장"));
    });

    jest
      .spyOn(SessionsAPI, "updateSessionFeedback")
      .mockResolvedValueOnce(true);

    await waitFor(() => {
      fireEvent.press(getByTestId("저장"));
    });
  });

  it("should handle upcoming lesson", async () => {
    jest
      .spyOn(SessionsAPI, "getSessionDetails")
      .mockResolvedValue({...sampleLesson, done: false});

    await waitFor(() => renderWithProviders(<LessonDetail />));
  });

  it("should handle api error", async () => {
    jest
      .spyOn(SessionsAPI, "getSessionDetails")
      .mockResolvedValue(null);

    await waitFor(() => renderWithProviders(<LessonDetail />));
  });
});
