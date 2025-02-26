import { fireEvent, waitFor } from "@testing-library/react-native";

import { ProgramEdit } from "./ProgramEdit";
import { CoachSimpleType } from "@models/products";
import * as ProgramsAPI from "@services/products/programs";
import {
  sampleAcademyPrograms,
  sampleCoaches,
  sampleProgramPositions,
  sampleProgramTargets,
} from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
  useLocalSearchParams: jest.fn().mockReturnValue({ id: "1" }),
}));
jest.mock("@fragments/Coach", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");
  const { sampleCoaches } = jest.requireActual("@testdata/products");

  return {
    CoachModal: ({
      addCoachTeam,
    }: {
      addCoachTeam: (coaches: CoachSimpleType[]) => void;
    }) => (
      <TouchableOpacity
        onPress={() => addCoachTeam(sampleCoaches)}
        testID="save-coaches"
      />
    ),
  };
});
jest.mock("@fragments/Program", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    CoachTeam: ({ removeTeam }: { removeTeam: (index: number) => void }) => (
      <TouchableOpacity onPress={() => removeTeam(1)} testID="remove-team" />
    ),
    CurriculumModal: ({ submit }: { submit: () => void }) => (
      <TouchableOpacity onPress={submit} testID="save-curriculum" />
    ),
    EditCurriculum: () => <div>EditCurriculum</div>,
    MultiSelect: ({
      setSelected,
    }: {
      setSelected: (value: number) => void;
    }) => (
      <>
        <TouchableOpacity
          onPress={() => setSelected(1)}
          testID="multi-unselect"
        />
        <TouchableOpacity
          onPress={() => setSelected(2)}
          testID="multi-select"
        />
      </>
    ),
    SingleSelect: ({
      setSelected,
    }: {
      setSelected: (value: number) => void;
    }) => (
      <TouchableOpacity onPress={() => setSelected(1)} testID="single-select" />
    ),
  };
});

describe("<ProgramEdit />", () => {
  beforeEach(() => {
    jest.spyOn(ProgramsAPI, "getProgramDetail").mockResolvedValue({
      program: sampleAcademyPrograms[0],
      targets: sampleProgramTargets,
      positions: sampleProgramPositions,
      coaches: sampleCoaches,
    });
  });

  it("handles program edit correctly", async () => {
    const { getAllByTestId, getByTestId } = renderWithProviders(
      <ProgramEdit />
    );

    jest.spyOn(ProgramsAPI, "editProgram").mockResolvedValueOnce(null);
    await waitFor(() => {
      fireEvent.press(getAllByTestId("single-select")[0]); // Select duration
      fireEvent.press(getAllByTestId("single-select")[1]); // Select target
      fireEvent.press(getByTestId("multi-select")); // Select position
      fireEvent.press(getByTestId("multi-unselect")); // Unselect position
      fireEvent.press(getByTestId("저장"));
    });

    jest.spyOn(ProgramsAPI, "editProgram").mockResolvedValueOnce(true);
    await waitFor(() => {
      fireEvent.press(getByTestId("저장"));
    });
  });

  it("handles program delete correctly", async () => {
    const { getByTestId } = renderWithProviders(<ProgramEdit />);

    jest.spyOn(ProgramsAPI, "deleteProgram").mockResolvedValueOnce(null);
    await waitFor(() => {
      fireEvent.press(getByTestId("삭제"));
    });

    jest.spyOn(ProgramsAPI, "deleteProgram").mockResolvedValueOnce(true);
    await waitFor(() => {
      fireEvent.press(getByTestId("삭제"));
    });
  });

  it("handles coach teams edit correctly", async () => {
    jest.spyOn(ProgramsAPI, "getProgramDetail").mockResolvedValue({
      program: {
        ...sampleAcademyPrograms[0],
        random_assignment: false,
        teams: [{ id: 0, coaches: sampleCoaches }],
      },
      targets: sampleProgramTargets,
      positions: sampleProgramPositions,
      coaches: sampleCoaches,
    });

    const { getByTestId } = renderWithProviders(<ProgramEdit />);

    jest.spyOn(ProgramsAPI, "toggleCoachSelect").mockResolvedValueOnce(null);
    jest.spyOn(ProgramsAPI, "deleteCoachTeam").mockResolvedValueOnce(null);
    await waitFor(() => {
      fireEvent.press(getByTestId("toggle-coach-select")); // Toggle coach select
      fireEvent.press(getByTestId("remove-team")); // Remove Team
    });

    jest.spyOn(ProgramsAPI, "deleteCoachTeam").mockResolvedValueOnce(true);
    jest.spyOn(ProgramsAPI, "toggleCoachSelect").mockResolvedValueOnce(true);
    jest.spyOn(ProgramsAPI, "addCoachTeam").mockResolvedValueOnce(null);
    await waitFor(() => {
      fireEvent.press(getByTestId("remove-team")); // Remove Team
      fireEvent.press(getByTestId("toggle-coach-select")); // Toggle coach select
      fireEvent.press(getByTestId("plus")); // Open coaches modal
      fireEvent.press(getByTestId("save-coaches")); // Save coaches
    });

    jest.spyOn(ProgramsAPI, "addCoachTeam").mockResolvedValueOnce(true);
    await waitFor(() => {
      fireEvent.press(getByTestId("save-coaches")); // Save coaches
    });
  });

  it("handles curriculum edit correctly", async () => {
    const { getByTestId } = renderWithProviders(<ProgramEdit />);

    jest.spyOn(ProgramsAPI, "saveCurriculums").mockResolvedValueOnce(null);
    await waitFor(() => {
      fireEvent.press(getByTestId("open-curriculum-modal")); // Open curriculum modal
      fireEvent.press(getByTestId("save-curriculum")); // Save curriculum
    });

    jest.spyOn(ProgramsAPI, "saveCurriculums").mockResolvedValueOnce(true);
    await waitFor(() => {
      fireEvent.press(getByTestId("save-curriculum")); // Save curriculum
    });
  });

  it("handles api error", async () => {
    jest.spyOn(ProgramsAPI, "getProgramDetail").mockResolvedValue(null);

    waitFor(() => renderWithProviders(<ProgramEdit />));
  });
});
