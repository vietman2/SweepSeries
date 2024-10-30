import { LikedAcademies } from "./LikedAcademies";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Academy", () => ({
  AcademySimple: () => null,
}));

describe("<LikedAcademies />", () => {
  it("renders correctly", () => {
    renderWithProviders(<LikedAcademies />);
  });
});
