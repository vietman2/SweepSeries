import { sampleCoaches } from "@testdata/products";
import { CoachModal } from "./CoachModal";
import { renderWithProviders } from "@utils/test-utils";
import { fireEvent } from "@testing-library/react-native";

jest.mock("../CoachSelect/CoachSelect", () => ({
  CoachSelect: () => <></>,
}));

describe("<CoachModal />", () => {
  it("renders and handles select correctly", () => {
    const { getByTestId } = renderWithProviders(
      <CoachModal
        coaches={sampleCoaches}
        closeModal={jest.fn()}
        addCoachTeam={jest.fn()}
      />
    );

    fireEvent.press(getByTestId("coach-1")); // Select coach 1
    fireEvent.press(getByTestId("coach-2")); // Select coach 2
    fireEvent.press(getByTestId("coach-1")); // Deselect coach 1
    fireEvent.press(getByTestId("확인")); // Deselect coach 1
  });
});
