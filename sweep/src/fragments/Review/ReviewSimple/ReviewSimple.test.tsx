import { ReviewSimple } from "./ReviewSimple";
import { sampleReviews } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<ReviewSimple />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <>
        <ReviewSimple review={sampleReviews[0]} />
        <ReviewSimple review={{ ...sampleReviews[0], academy_rating: 4 }} />
        <ReviewSimple review={{ ...sampleReviews[0], academy_rating: 3 }} />
        <ReviewSimple review={{ ...sampleReviews[0], academy_rating: 2 }} />
        <ReviewSimple review={{ ...sampleReviews[0], academy_rating: 1 }} />
      </>
    );
  });
});
