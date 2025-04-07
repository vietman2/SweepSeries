import { fireEvent, waitFor } from "@testing-library/react-native";

import { ReviewManagement } from "./ReviewManagement";
import * as ReviewsAPI from "@services/products/reviews";
import {
  sampleReviewResponse,
  sampleReviews,
  sampleReviewSummary,
} from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Review", () => ({
  ReviewsSummary: () => <div data-testid="reviews-summary" />,
  ReviewSimple: () => <div data-testid="review-simple" />,
}));

describe("<ReviewManagement />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(ReviewsAPI, "getAcademyReviewSummary")
      .mockResolvedValue(sampleReviewSummary);
    jest
      .spyOn(ReviewsAPI, "getAcademyReviews")
      .mockResolvedValue({ ...sampleReviewResponse, results: sampleReviews });
  });

  it("renders correctly and handles tab switching", async () => {
    const { getByTestId } = renderWithProviders(<ReviewManagement />);

    await waitFor(() => {
      fireEvent.press(getByTestId("tab-all"));
      fireEvent.press(getByTestId("tab-unanswered"));
    });
  });

  it("handles api error", async () => {
    jest.spyOn(ReviewsAPI, "getAcademyReviewSummary").mockResolvedValue(null);

    renderWithProviders(<ReviewManagement />);
  });
});
