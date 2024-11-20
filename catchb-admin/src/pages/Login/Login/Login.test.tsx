import { Login } from "./Login";
import { renderWithProviders } from "@utils/test-utils";

describe("<Login />", () => {
  it("renders without crashing", () => {
    renderWithProviders(<Login />);
  });
});
