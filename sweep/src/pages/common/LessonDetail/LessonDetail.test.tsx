import { act, fireEvent, waitFor } from "@testing-library/react-native";
import * as Router from "expo-router";

import { LessonDetail } from "./LessonDetail";
import * as SessionsAPI from "@services/calendar/sessions";
import { sampleLesson } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";
import { sampleAvailableTimes } from "@testdata/products";

jest.mock("@fragments/DateTimeSelector", () => ({
  LessonDateSelector: () => <div>LessonDateSelector</div>,
  TimeSelector: () => <div>TimeSelector</div>,
}));
jest.mock("@fragments/Lesson", () => ({
  LessonSimple: () => <div>LessonSimple</div>,
}));

describe("<LessonDetail />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest
      .spyOn(Router, "useLocalSearchParams")
      .mockReturnValue({ id: "1", mode: "normal" });
    jest
      .spyOn(SessionsAPI, "getSessionDetails")
      .mockResolvedValue(sampleLesson);
    jest
      .spyOn(SessionsAPI, "getSessionAvailableTimes")
      .mockResolvedValue({ times: sampleAvailableTimes });
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
    jest
      .spyOn(SessionsAPI, "getSessionAvailableTimes")
      .mockResolvedValueOnce({});

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

  it("should handle upcoming lesson schedule change", async () => {
    jest
      .spyOn(SessionsAPI, "getSessionDetails")
      .mockResolvedValue({ ...sampleLesson, done: false });
    jest
      .spyOn(SessionsAPI, "getSessionAvailableTimes")
      .mockResolvedValueOnce(null);

    const { getByTestId } = renderWithProviders(<LessonDetail />);

    jest
      .spyOn(SessionsAPI, "requestSessionScheduleChange")
      .mockResolvedValueOnce(null);

    await waitFor(() => {
      fireEvent.press(getByTestId("예약 변경")); // open sheet
      fireEvent.press(getByTestId("예약하기")); // button press
      fireEvent.press(getByTestId("cancel")); // cancel
      fireEvent.press(getByTestId("예약 변경")); // open sheet
      fireEvent.press(getByTestId("예약하기")); // button press
      fireEvent.press(getByTestId("confirm")); // confirm: fail
    });

    jest
      .spyOn(SessionsAPI, "requestSessionScheduleChange")
      .mockResolvedValue(true);

    await waitFor(() => {
      fireEvent.press(getByTestId("confirm")); // confirm: success
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });
  });

  it("should handle upcoming lesson cancel", async () => {
    jest
      .spyOn(SessionsAPI, "getSessionDetails")
      .mockResolvedValue({ ...sampleLesson, done: false });
    jest
      .spyOn(SessionsAPI, "requestSessionScheduleChange")
      .mockResolvedValue(true);

    const { getByTestId } = renderWithProviders(<LessonDetail />);

    await waitFor(() => {
      fireEvent.press(getByTestId("예약 취소")); // cancel
    });
  });

  it("should handle api error", async () => {
    jest.spyOn(SessionsAPI, "getSessionDetails").mockResolvedValue(null);

    await waitFor(() => renderWithProviders(<LessonDetail />));
  });
});
