import { AcademyContainer } from "./AcademyContainer";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./Academies", () => ({
  AcademyList: () => <div>AcademyList</div>,
}));

describe("<AcademyContainer />", () => {
  it("renders", () => {
    renderWithProviders(<AcademyContainer />);
  });
});
