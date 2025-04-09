import { fireEvent, waitFor } from "@testing-library/react-native";

import { CreateProgram } from "./CreateProgram";
import * as AcademyFrontContext from "@contexts/front";
import { CoachSimpleType } from "@models/products";
import * as CoachesAPI from "@services/products/coach";
import * as ProgramsAPI from "@services/products/programs";
import {
  sampleAcademyDetail,
  sampleCoaches,
  sampleProgramPositions,
  sampleProgramTargets,
} from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

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
jest.mock("@fragments/Program", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    NewCurriculum: () => null,
    MultiSelect: ({
      setSelected,
    }: {
      setSelected: (value: number) => void;
    }) => (
      <TouchableOpacity onPress={() => setSelected(1)} testID="multi-select" />
    ),
    SingleSelect: () => null,
  };
});

describe("<CreateProgram />", () => {
  const defaultContext = {
    academy: sampleAcademyDetail,
    programs: [],
    notices: [],
    facilityOptions: [],
    loading: false,
    refresh: jest.fn(),
  };

  beforeEach(() => {
    jest
      .spyOn(AcademyFrontContext, "useAcademyFront")
      .mockReturnValue(defaultContext);
    jest.spyOn(CoachesAPI, "getCoaches").mockResolvedValue(sampleCoaches);
    jest
      .spyOn(ProgramsAPI, "getTargets")
      .mockResolvedValue(sampleProgramTargets);
    jest
      .spyOn(ProgramsAPI, "getPositions")
      .mockResolvedValue(sampleProgramPositions);
  });

  it("handles create correctly", async () => {
    const { getByTestId } = renderWithProviders(<CreateProgram />);

    jest.spyOn(ProgramsAPI, "createProgram").mockResolvedValueOnce(null);
    await waitFor(() => {
      fireEvent.press(getByTestId("multi-select")); // Select position
      fireEvent.press(getByTestId("multi-select")); // Unselect position
      fireEvent.press(getByTestId("plus")); // Open coach modal
      fireEvent.press(getByTestId("add-coach-team")); // Add coach team
      fireEvent.press(getByTestId("toggle-coach-select")); // Disable select
      fireEvent.press(getByTestId("remove-coach-0")); // Disable select
      fireEvent.press(getByTestId("등록")); // Submit
    });

    jest.spyOn(ProgramsAPI, "createProgram").mockResolvedValue({});
    await waitFor(() => {
      fireEvent.press(getByTestId("등록")); // Submit
    });
  });

  it("handles bad initialization", async () => {
    jest.spyOn(ProgramsAPI, "getTargets").mockResolvedValue(null);
    jest.spyOn(ProgramsAPI, "getPositions").mockResolvedValue(null);
    jest.spyOn(ProgramsAPI, "createProgram").mockResolvedValue({});
    renderWithProviders(<CreateProgram />);
  });

  it("handles bad config", async () => {
    jest
      .spyOn(AcademyFrontContext, "useAcademyFront")
      .mockReturnValue({ ...defaultContext, academy: null });
    renderWithProviders(<CreateProgram />);
  });
});
