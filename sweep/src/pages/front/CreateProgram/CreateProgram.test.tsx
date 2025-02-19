import { fireEvent, waitFor } from "@testing-library/react-native";

import { CreateProgram } from "./CreateProgram";
import { CoachSimpleType } from "@models/products";
import * as CoachesAPI from "@services/products/coach";
import * as ProgramsAPI from "@services/products/programs";
import {
  sampleCoaches,
  sampleProgramPositions,
  sampleProgramTargets,
} from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    navigate: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({ uuid: "uuid" })),
}));
jest.mock("@fragments/Coach", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");
  const { sampleCoaches } = jest.requireActual("@testdata/products");

  return {
    CoachModal: ({
      addCoachTeam,
      closeModal,
    }: {
      addCoachTeam: (coaches: CoachSimpleType[]) => void;
      closeModal: () => void;
    }) => (
      <>
        <TouchableOpacity
          testID="add-coach-team"
          onPress={() => addCoachTeam([sampleCoaches[0]])}
        />
        <TouchableOpacity testID="close-coach-modal" onPress={closeModal} />
      </>
    ),
    CoachSelect: () => null,
  };
});
jest.mock("@fragments/Program", () => ({
  NewCurriculum: () => null,
}));

describe("<CreateProgram />", () => {
  beforeEach(() => {
    jest.spyOn(CoachesAPI, "getCoaches").mockResolvedValue(sampleCoaches);
    jest
      .spyOn(ProgramsAPI, "getTargets")
      .mockResolvedValue(sampleProgramTargets);
    jest
      .spyOn(ProgramsAPI, "getPositions")
      .mockResolvedValue(sampleProgramPositions);
  });

  it("handles create correctly", async () => {
    jest.spyOn(ProgramsAPI, "createProgram").mockResolvedValue({});
    const { getByTestId } = renderWithProviders(<CreateProgram />);

    await waitFor(() => {
      fireEvent.press(getByTestId("60분")); // Select duration
      fireEvent.press(getByTestId("투수레슨")); // Select position
      fireEvent.press(getByTestId("선수반")); // Select target
      fireEvent.press(getByTestId("plus")); // Open coach modal
      fireEvent.press(getByTestId("add-coach-team")); // Select coaches
      fireEvent.press(getByTestId("close-coach-modal")); // Close coach modal
      fireEvent.press(getByTestId("remove-coach-0")); // Close coach modal
      fireEvent.press(getByTestId("저장")); // Submit
    });
  });

  it("handles create fail and coach select toggle", async () => {
    jest.spyOn(ProgramsAPI, "createProgram").mockResolvedValue(null);
    const { getByTestId } = renderWithProviders(<CreateProgram />);

    await waitFor(() => {
      fireEvent.press(getByTestId("60분")); // Select duration
      fireEvent.press(getByTestId("투수레슨")); // Select position
      fireEvent.press(getByTestId("선수반")); // Select target
      fireEvent.press(getByTestId("toggle-coach-select")); // Close coach modal
      fireEvent.press(getByTestId("저장"));
    });
  });

  it("handles bad initialization", async () => {
    jest.spyOn(ProgramsAPI, "getTargets").mockResolvedValue(null);
    jest.spyOn(ProgramsAPI, "getPositions").mockResolvedValue(null);
    jest.spyOn(ProgramsAPI, "createProgram").mockResolvedValue({});
    renderWithProviders(<CreateProgram />);
  });
});
