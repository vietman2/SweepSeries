import { fireEvent, waitFor } from "@testing-library/react-native";

import { Home } from "./Home";
import * as AuthContext from "@contexts/auth";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Academy", () => ({
  AcademyCards: () => "AcademyCards",
  AcademySearch: () => "AcademySearch",
  Recommendations: () => "Recommendations",
}));

describe("<Home />", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("handles normal mode and refresh", async () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      mode: "normal",
      selectedProfile: null,
      login: jest.fn(),
      logout: jest.fn(),
    });

    const { getByTestId } = renderWithProviders(<Home />);

    await waitFor(() => {
      fireEvent.press(getByTestId("refresh"));
      jest.advanceTimersByTime(1000);
    });
  });

  it("handles pro mode correctly", async () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      mode: "pro",
      selectedProfile: null,
      login: jest.fn(),
      logout: jest.fn(),
    });
    renderWithProviders(<Home />);
  });
});
