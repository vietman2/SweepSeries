import { fireEvent } from "@testing-library/react-native";

import { Home } from "./Home";
import * as AuthContext from "@contexts/auth";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));
jest.mock("@gorhom/bottom-sheet", () => ({
  __esModule: true,
  default: "BottomSheet",
  BottomSheetBackdrop: () => "BottomSheetBackdrop",
  BottomSheetBackdropProps: null,
  BottomSheetView: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("@contexts/auth", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAuth: jest.fn(),
}));
jest.mock("@fragments/Academy", () => ({
  AcademyCard: () => "AcademyCard",
  AcademySimple: () => "AcademySimple",
  AcademySuggest: () => "AcademySuggest",
}));

describe("<Home />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      mode: "normal",
      isAuthenticated: true,
    });
  });

  it("handles filter correctly", () => {
    const { getByTestId } = renderWithProviders(<Home />);

    fireEvent.press(getByTestId("filter"));
    fireEvent.press(getByTestId("filter"));
  });

  it("handles sort correctly", () => {
    const { getByTestId } = renderWithProviders(<Home />);

    fireEvent.press(getByTestId("sort-button"));
    fireEvent.press(getByTestId("sort-item-인기순"));
  });
  
  it("handles navigate to academy detail correctly", () => {
    const { getByTestId } = renderWithProviders(<Home />);

    fireEvent.press(getByTestId("academy-1"));
    fireEvent.press(getByTestId("academy-detail-1"));
  });

  it("renders pro home correctly", () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      mode: "pro",
      isAuthenticated: true,
    });

    renderWithProviders(<Home />);
  });
});
