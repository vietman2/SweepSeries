import { fireEvent } from "@testing-library/react-native";

import { NormalHome } from "./NormalHome";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@gorhom/bottom-sheet", () => {
  return {
    __esModule: true,
    default: "BottomSheet",
    BottomSheetBackdrop: () => "BottomSheetBackdrop",
    BottomSheetBackdropProps: null,
    BottomSheetView: ({ children }: { children: React.ReactNode }) => children,
  };
});
jest.mock("@fragments/Academy", () => ({
  AcademyCard: () => <div>AcademyCard</div>,
  AcademySimple: () => <div>AcademySimple</div>,
  AcademySuggest: () => <div>AcademySuggest</div>,
}));

describe("<NormalHome />", () => {
  it("handles filter correctly", () => {
    const { getByTestId } = renderWithProviders(<NormalHome />);

    fireEvent.press(getByTestId("filter"));
    fireEvent.press(getByTestId("filter"));
  });

  it("handles sort correctly", () => {
    const { getByTestId } = renderWithProviders(<NormalHome />);

    fireEvent.press(getByTestId("sort-button"));
    fireEvent.press(getByTestId("sort-item-인기순"));
  });
});
