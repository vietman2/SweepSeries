import { MyReviews } from "./MyReviews";
import { renderWithProviders } from "@utils/test-utils";

describe("<MyReviews />", () => {
  it("renders correctly", () => {
    renderWithProviders(<MyReviews />);
  });
});
