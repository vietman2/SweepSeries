import { fireEvent } from "@testing-library/react-native";

import { CoachList } from "./CoachList";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));
jest.mock("@fragments/Coach", () => ({
  CoachSimple: () => <></>,
}));

describe("<CoachList />", () => {
  it("renders correctly and handles navigation", () => {
    const { getByTestId } = renderWithProviders(<CoachList />);

    fireEvent.press(getByTestId("coach-1"));
  });
});
