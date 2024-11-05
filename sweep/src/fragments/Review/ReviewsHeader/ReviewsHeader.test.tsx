import { ReviewsHeader } from "./ReviewsHeader";
import { renderWithProviders } from "@utils/test-utils";

describe("<ReviewsHeader />", () => {
  it("should render", () => {
    renderWithProviders(<ReviewsHeader rating={4.5} />);
  });
});
