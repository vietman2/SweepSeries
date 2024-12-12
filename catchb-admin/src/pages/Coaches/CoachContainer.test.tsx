import { CoachContainer } from "./CoachContainer";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./Coaches", () => ({
  CoachList: () => <div>CoachList</div>,
}));

describe("<CoachContainer />", () => {
  it("renders", () => {
    renderWithProviders(<CoachContainer />);
  });
});
