import { fireEvent } from "@testing-library/react-native";

import { ProHome } from "./ProHome";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Academy", () => ({
  AcademyCard: () => <div>AcademyCard</div>,
  AcademySimple: () => <div>AcademySimple</div>,
}));

describe("<ProHome />", () => {
  it("renders and handles filters", () => {
    const { getByTestId } = renderWithProviders(<ProHome />);

    fireEvent.press(getByTestId("filter"));
    fireEvent.press(getByTestId("filter"));
  });
});
