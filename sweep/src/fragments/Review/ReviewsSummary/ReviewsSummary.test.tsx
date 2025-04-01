import { ReviewsSummary } from "./ReviewsSummary";
import { sampleReviewSummary } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<ReviewsSummary />", () => {
  it("renders correctly", () => {
    renderWithProviders(<ReviewsSummary summary={sampleReviewSummary} />);
  });
});
