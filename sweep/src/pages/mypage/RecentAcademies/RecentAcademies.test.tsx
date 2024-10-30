import { RecentAcademies } from "./RecentAcademies";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Academy", () => ({
  AcademySimple: () => null,
}));

describe("<RecentAcademies />", () => {
  it("renders correctly", () => {
    renderWithProviders(<RecentAcademies />);
  });
});
