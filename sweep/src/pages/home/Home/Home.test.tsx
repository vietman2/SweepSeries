import { fireEvent, waitFor } from "@testing-library/react-native";

import { Home } from "./Home";
import * as AuthContext from "@contexts/auth";
import * as AcademyAPI from "@services/products/academy";
import { sampleAuthor } from "@testdata/auth";
import { renderWithProviders } from "@utils/test-utils";
import { sampleAcademies } from "@testdata/products";

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
      selectedProfile: sampleAuthor,
    });
  });

  it("handles search correctly", async () => {
    jest
      .spyOn(AcademyAPI, "getAcademies")
      .mockResolvedValue({ academies: [], suggestions: sampleAcademies });
    const { getByTestId } = renderWithProviders(<Home />);

    await waitFor(() => {
      fireEvent.press(getByTestId("filter"));
      fireEvent.press(getByTestId("filter"));
      fireEvent.press(getByTestId("sort-button"));
      fireEvent.press(getByTestId("sort-item-인기순"));
      fireEvent.press(getByTestId("academy-1"));
    });
  });

  it("renders pro home correctly", async () => {
    jest
      .spyOn(AcademyAPI, "getAcademies")
      .mockResolvedValue({ academies: sampleAcademies, suggestions: [] });
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      mode: "pro",
      isAuthenticated: true,
      selectedProfile: sampleAuthor,
    });

    const { getByTestId } = renderWithProviders(<Home />);

    await waitFor(() => {
      fireEvent.press(getByTestId("academy-detail-1"));
    });
  });
});
