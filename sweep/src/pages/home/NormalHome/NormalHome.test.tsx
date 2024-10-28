import { fireEvent } from "@testing-library/react-native";
import { NormalHome } from "./NormalHome";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Academy", () => ({
  AcademySimple: () => <div>AcademySimple</div>,
  AcademySuggest: () => <div>AcademySuggest</div>,
  MyAcademy: () => <div>MyAcademy</div>,
}));

describe("<NormalHome />", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProviders(<NormalHome />);

    fireEvent.press(getByTestId("filter"));
    fireEvent.press(getByTestId("filter"));
  });
});
