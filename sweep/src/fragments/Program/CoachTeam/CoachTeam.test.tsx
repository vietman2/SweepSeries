import { fireEvent } from "@testing-library/react-native";

import { CoachTeam } from "./CoachTeam";
import { sampleCoachTeam } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Coach", () => ({
  CoachSelect: () => <div>CoachSelect</div>,
}));

describe("<CoachTeam />", () => {
  it("renders the coaches", () => {
    const { getByTestId } = renderWithProviders(
      <CoachTeam team={sampleCoachTeam} onPress={jest.fn()} />
    );

    fireEvent.press(getByTestId("remove"));
  });

  it("handles remove", () => {
    const { getByTestId } = renderWithProviders(
      <CoachTeam team={sampleCoachTeam} type={2} onPress={jest.fn()} />
    );

    fireEvent.press(getByTestId("button"));
  });
});
