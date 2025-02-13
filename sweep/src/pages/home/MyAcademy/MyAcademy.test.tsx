import { fireEvent, waitFor } from "@testing-library/react-native";

import { MyAcademy } from "./MyAcademy";
import * as SessionsAPI from "@services/calendar/sessions";
import { renderWithProviders } from "@utils/test-utils";
import { sampleLesson } from "@testdata/calendar";

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
  it("should render correctly (month < 10) and handle api error", () => {
    jest.spyOn(SessionsAPI, "getSessions").mockResolvedValue(null);
    jest.spyOn(Date.prototype, "getFullYear").mockReturnValue(2024);
    jest.spyOn(Date.prototype, "getMonth").mockReturnValue(1);

    waitFor(() => renderWithProviders(<MyAcademy />));
  });

  it("should render correctly (month >= 10)", async () => {
    jest.spyOn(SessionsAPI, "getSessions").mockResolvedValue([sampleLesson]);
    jest.spyOn(Date.prototype, "getFullYear").mockReturnValue(2024);
    jest.spyOn(Date.prototype, "getMonth").mockReturnValue(11);

    const { getByTestId } = renderWithProviders(<MyAcademy />);

    await waitFor(() => {
      fireEvent.press(getByTestId("lesson-1"));
    });
  });
});
