import { ProgramManagement } from "./Programs";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Program", () => ({
  ProgramSimple: () => "ProgramSimple",
}));

describe("<ProgramManagement />", () => {
  it("renders correctly", () => {
    renderWithProviders(<ProgramManagement />);
  });
});
