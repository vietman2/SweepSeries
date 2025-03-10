import { fireEvent, waitFor } from "@testing-library/react-native";
import * as Router from "expo-router";

import { Reservation } from "./Reservation";
import { TeamType } from "@models/products";
import * as ProgramsAPI from "@services/products/programs";
import {
  sampleAcademyPrograms,
  sampleAvailableTimes,
} from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
}));
jest.mock("@fragments/Program", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    ProgramSimple: () => <></>,
    CoachTeam: ({ team, onPress }: { team: TeamType; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress} testID={`select-${team.id}`} />
    ),
  };
});

describe("<Reservation />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-10-01").getTime());
    jest.spyOn(Router, "useLocalSearchParams").mockReturnValue({ id: "1" });
    jest
      .spyOn(ProgramsAPI, "getProgramDetail")
      .mockResolvedValue({ program: sampleAcademyPrograms[0] });
    jest
      .spyOn(ProgramsAPI, "getAvailableTimes")
      .mockResolvedValue(sampleAvailableTimes);
  });

  it("handles api error", async () => {
    jest.spyOn(ProgramsAPI, "getProgramDetail").mockResolvedValue(null);

    renderWithProviders(<Reservation />);
  });

  it("handles request (random assignment)", async () => {
    const { getByTestId } = renderWithProviders(<Reservation />);

    await waitFor(() => {
      fireEvent.press(getByTestId("curriculum-1")); // Select curriculum
      fireEvent.press(getByTestId("day-2024-10-20")); // Select day
      fireEvent.press(getByTestId("time-09:00")); // Select time
      fireEvent.press(getByTestId("time-09:30")); // Select time
    });

    await waitFor(() => {
      fireEvent.press(getByTestId("예약하기")); // Submit
      fireEvent.press(getByTestId("cancel"));
    });

    jest.spyOn(ProgramsAPI, "createLessonRequest").mockResolvedValueOnce(null);
    await waitFor(() => {
      fireEvent.press(getByTestId("예약하기")); // Submit
      fireEvent.press(getByTestId("confirm"));
    });

    jest.spyOn(ProgramsAPI, "createLessonRequest").mockResolvedValueOnce(true);
    await waitFor(() => {
      fireEvent.press(getByTestId("confirm")); // Submit
    });
  });

  it("handles request (select team)", async () => {
    jest
      .spyOn(ProgramsAPI, "getProgramDetail")
      .mockResolvedValue({ program: sampleAcademyPrograms[1] });
    const { getByTestId } = renderWithProviders(<Reservation />);

    jest.spyOn(ProgramsAPI, "getAvailableTimes").mockResolvedValueOnce(null);

    await waitFor(() => {
      fireEvent.press(getByTestId("select-1")); // Select team
      fireEvent.press(getByTestId("unselect-team")); // Unselect team
      fireEvent.press(getByTestId("select-1")); // Reselect team
    });
  });
});
