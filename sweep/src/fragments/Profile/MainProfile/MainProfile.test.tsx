import { MainProfile } from "./MainProfile";
import { renderWithProviders } from "@utils/test-utils";

describe("<MainProfile>", () => {
  it("renders correctly", () => {
    renderWithProviders(<MainProfile />);
  });
});
