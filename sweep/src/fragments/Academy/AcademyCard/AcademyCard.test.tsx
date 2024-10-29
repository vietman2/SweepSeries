import { fireEvent } from "@testing-library/react-native";

import { AcademyCard } from "./AcademyCard";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

describe("<AcademyCard />", () => {
  it("renders type 1 correctly", () => {
    const { getByTestId } = renderWithProviders(<AcademyCard />);

    fireEvent.press(getByTestId("myacademy"));
  });

  it("renders type 2 correctly", () => {
    renderWithProviders(<AcademyCard type={2} />);
  });
});
