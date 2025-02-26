import { CoachTeam } from "./CoachTeam";
import { sampleCoachTeam } from "@testdata/products";
import { fireEvent } from "@testing-library/react-native";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Coach", () => ({
  CoachSelect: () => <div>CoachSelect</div>,
}));

describe("<CoachTeam />", () => {
  it("renders the coaches", () => {
    renderWithProviders(<CoachTeam team={sampleCoachTeam} />);
  });

  it("handles remove", () => {
    const { getByTestId } = renderWithProviders(
      <CoachTeam team={sampleCoachTeam} removeTeam={jest.fn()} />
    );

    fireEvent.press(getByTestId("remove"));
  });
});
