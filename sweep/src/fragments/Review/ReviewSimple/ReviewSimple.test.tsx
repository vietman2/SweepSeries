import { ReviewSimple } from "./ReviewSimple";
import { sampleReviews } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<ReviewSimple />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <>
        <ReviewSimple review={sampleReviews[0]} />
        <ReviewSimple review={{ ...sampleReviews[0], rating: 4 }} />
        <ReviewSimple review={{ ...sampleReviews[0], rating: 3 }} />
        <ReviewSimple review={{ ...sampleReviews[0], rating: 2 }} />
        <ReviewSimple review={{ ...sampleReviews[0], rating: 1 }} />
      </>
    );
  });
});
