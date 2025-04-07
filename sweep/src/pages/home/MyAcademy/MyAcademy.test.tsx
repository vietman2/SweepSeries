import { fireEvent, waitFor } from "@testing-library/react-native";

import { MyAcademy } from "./MyAcademy";
import * as AuthContext from "@contexts/auth";
import * as HomeContext from "@contexts/home";
import * as SessionsAPI from "@services/calendar/sessions";
import { sampleLesson } from "@testdata/calendar";
import { sampleAcademies } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Academy", () => ({
  NormalCard: () => null,
  ProCard: () => null,
}));
jest.mock("@fragments/Lesson", () => ({
  LessonSimple: () => null,
}));

describe("<MyAcademy />", () => {
  beforeEach(() => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      selectedProfile: null,
      mode: "normal",
      login: jest.fn(),
      logout: jest.fn(),
    });
    jest.spyOn(HomeContext, "useHome").mockReturnValue({
      academy: sampleAcademies[0],
      selectAcademy: jest.fn(),
    });
  });

  it("should render correctly (month < 10) and handle api error", () => {
    jest.spyOn(SessionsAPI, "getSessions").mockResolvedValue(null);
    jest.spyOn(Date.prototype, "getFullYear").mockReturnValue(2024);
    jest.spyOn(Date.prototype, "getMonth").mockReturnValue(1);

    waitFor(() => renderWithProviders(<MyAcademy />));
  });

  it("should render correctly (month >= 10) as pro mode and handle refresh", async () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      selectedProfile: null,
      mode: "pro",
      login: jest.fn(),
      logout: jest.fn(),
    });
    jest.spyOn(SessionsAPI, "getSessions").mockResolvedValue([sampleLesson]);
    jest.spyOn(Date.prototype, "getFullYear").mockReturnValue(2024);
    jest.spyOn(Date.prototype, "getMonth").mockReturnValue(11);

    const { getByTestId } = renderWithProviders(<MyAcademy />);

    await waitFor(() => {
      fireEvent.press(getByTestId("lesson-1"));
      fireEvent.press(getByTestId("refresh"));
    });
  });

  it("handles no selected academy", async () => {
    jest.spyOn(HomeContext, "useHome").mockReturnValue({
      academy: null,
      selectAcademy: jest.fn(),
    });

    waitFor(() => renderWithProviders(<MyAcademy />));
  });
});
