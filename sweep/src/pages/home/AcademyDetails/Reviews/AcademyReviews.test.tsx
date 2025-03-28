import { fireEvent, waitFor } from "@testing-library/react-native";

import { AcademyReviews } from "./AcademyReviews";
import * as AcademyContext from "@contexts/academy";
import * as ReviewsAPI from "@services/products/reviews";
import {
  sampleAcademyDetail,
  sampleReviewResponse,
  sampleReviews,
  sampleReviewSummary,
} from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Review", () => ({
  ReviewsSummary: () => "ReviewsSummary",
  ReviewSimple: () => "ReviewSimple",
}));

describe("<AcademyReviews />", () => {
  const defaultContext = {
    academy: sampleAcademyDetail,
    showDetailPage: false,
    selectCoach: jest.fn(),
    selectNotice: jest.fn(),
  };

  beforeEach(() => {
    jest
      .spyOn(AcademyContext, "useAcademyDetail")
      .mockReturnValue(defaultContext);
    jest
      .spyOn(ReviewsAPI, "getAcademyReviewSummary")
      .mockResolvedValue(sampleReviewSummary);
    jest
      .spyOn(ReviewsAPI, "getAcademyReviews")
      .mockResolvedValue({ ...sampleReviewResponse, results: sampleReviews });
  });

  it("renders and handles load more correctly", async () => {
    const { getByTestId } = renderWithProviders(<AcademyReviews />);

    await waitFor(() => {
      fireEvent.press(getByTestId("load-more"));
    });
  });

  it("handles bad api response", async () => {
    jest.spyOn(ReviewsAPI, "getAcademyReviews").mockResolvedValue(null);

    waitFor(() => {
      renderWithProviders(<AcademyReviews />);
    });
  });

  it("handles bad config", async () => {
    jest
      .spyOn(AcademyContext, "useAcademyDetail")
      .mockReturnValue({ ...defaultContext, academy: null });

    renderWithProviders(<AcademyReviews />);
  });
});
