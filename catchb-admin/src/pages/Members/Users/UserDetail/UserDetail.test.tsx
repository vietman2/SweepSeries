import { UserDetail } from "./UserDetail";
import { renderWithProviders } from "@utils/test-utils";

describe("<UserDetail />", () => {
  it("renders", () => {
    renderWithProviders(<UserDetail />);
  });
});
