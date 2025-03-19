import { fireEvent, waitFor } from "@testing-library/react-native";

import { ReservationRequests } from "./ReservationRequests";
import * as CalendarContext from "@contexts/calendar";
import * as LessonsAPI from "@services/calendar/lessons";
import { sampleCalendars, sampleLessonRequests } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Lesson", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    LessonRequestSimple: ({ onCheck }: { onCheck: () => void }) => (
      <TouchableOpacity onPress={onCheck} testID="request" />
    ),
  };
});

describe("<ReservationRequests />", () => {
  beforeEach(() => {
    jest
      .spyOn(LessonsAPI, "getLessonRequests")
      .mockResolvedValue(sampleLessonRequests);
    jest.spyOn(CalendarContext, "useCalendar").mockReturnValue({
      selectedCalendar: sampleCalendars[1],
      calendars: [],
      isReady: true,
      reloadData: jest.fn(),
      setSelectedCalendar: jest.fn(),
    });
  });

  it("handles bad config", async () => {
    jest.spyOn(CalendarContext, "useCalendar").mockReturnValue({
      selectedCalendar: sampleCalendars[0],
      calendars: [],
      isReady: true,
      reloadData: jest.fn(),
      setSelectedCalendar: jest.fn(),
    });

    renderWithProviders(<ReservationRequests />);
  });

  it("handles api error", async () => {
    jest
      .spyOn(LessonsAPI, "getLessonRequests")
      .mockResolvedValue(null);

    renderWithProviders(<ReservationRequests />);
  });

  it("handles accept correctly", async () => {
    const { getByTestId, getAllByTestId } = renderWithProviders(<ReservationRequests />);

    jest.spyOn(LessonsAPI, "acceptRequests").mockResolvedValueOnce(null);
    await waitFor(() => {
      fireEvent.press(getAllByTestId("request")[0]); // select request
      fireEvent.press(getAllByTestId("request")[0]); // unselect request
      fireEvent.press(getByTestId("accept")); // test error: no requests selected
      fireEvent.press(getAllByTestId("request")[0]); // select request
      fireEvent.press(getByTestId("accept")); // submit
    });

    jest.spyOn(LessonsAPI, "acceptRequests").mockResolvedValueOnce(true);
    await waitFor(() => {
      fireEvent.press(getByTestId("accept"));
    });
  });

  it("handles reject correctly", async () => {
    const { getByTestId, getAllByTestId } = renderWithProviders(
      <ReservationRequests />
    );

    jest.spyOn(LessonsAPI, "rejectRequests").mockResolvedValueOnce(null);
    await waitFor(() => {
      fireEvent.press(getByTestId("reject")); // test error: no requests selected
      fireEvent.press(getAllByTestId("request")[0]); // select request
      fireEvent.press(getByTestId("reject")); // submit
    });

    jest.spyOn(LessonsAPI, "rejectRequests").mockResolvedValueOnce(true);
    await waitFor(() => {
      fireEvent.press(getByTestId("reject"));
    });
  });
});
