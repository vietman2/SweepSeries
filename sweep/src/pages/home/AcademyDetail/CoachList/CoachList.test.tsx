import { CoachList } from "./CoachList";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Coach", () => ({
  CoachSimple: () => <></>,
}));

describe("<CoachList />", () => {
  it("renders correctly", () => {
    renderWithProviders(<CoachList />);
  });
});
