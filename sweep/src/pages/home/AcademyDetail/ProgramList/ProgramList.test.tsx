import { ProgramList } from "./ProgramList";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Program", () => ({
  ProgramSimple: () => "ProgramSimple",
}));

describe("<ProgramList />", () => {
  it("renders correctly", () => {
    renderWithProviders(<ProgramList />);
  });
});
