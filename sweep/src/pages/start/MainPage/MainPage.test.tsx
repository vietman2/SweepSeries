import { MainPage } from "./MainPage";
import { renderWithProviders } from "@utils/test-utils";

describe("<MainPage>", () => {
  it("renders correctly", () => {
    renderWithProviders(<MainPage />);
  });
});
