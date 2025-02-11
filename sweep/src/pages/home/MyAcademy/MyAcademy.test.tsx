import { fireEvent } from "@testing-library/react-native";

import { MyAcademy } from "./MyAcademy";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));
jest.mock("@fragments/Academy", () => ({
  AcademyCard: () => null,
}));
jest.mock("@fragments/Lesson", () => ({
  LessonSimple: () => null,
}));

describe("<MyAcademy />", () => {
  it("should render correctly (month < 10)", () => {
    jest.spyOn(Date.prototype, "getFullYear").mockReturnValue(2024);
    jest.spyOn(Date.prototype, "getMonth").mockReturnValue(1);

    renderWithProviders(<MyAcademy />);
  });

  it("should render correctly (month >= 10)", () => {
    jest.spyOn(Date.prototype, "getFullYear").mockReturnValue(2024);
    jest.spyOn(Date.prototype, "getMonth").mockReturnValue(11);

    const { getByTestId } = renderWithProviders(<MyAcademy />);

    fireEvent.press(getByTestId("lesson-1"));
  });
});
