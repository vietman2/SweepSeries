import { fireEvent, waitFor } from "@testing-library/react-native";

import { AcademyReviews } from "./AcademyReviews";
import * as AcademyContext from "@contexts/academy";
import { sampleReviewResponse } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Review", () => ({
  ReviewsSummary: () => "ReviewsSummary",
  ReviewSimple: () => "ReviewSimple",
}));

describe("<AcademyReviews />", () => {
  const defaultContext = {
    academy: null,
    programs: [],
    coaches: [],
    notices: [],
    reviews: sampleReviewResponse,
    loading: false,
    showDetailPage: false,
    selectCoach: jest.fn(),
    selectNotice: jest.fn(),
    refresh: jest.fn(),
  };

  it("renders and handles load more correctly", async () => {
    jest
      .spyOn(AcademyContext, "useAcademyDetail")
      .mockReturnValue(defaultContext);

    const { getByTestId } = renderWithProviders(<AcademyReviews />);

    await waitFor(() => {
      fireEvent.press(getByTestId("load-more"));
    });
  });

  it("renders empty list", async () => {
    jest.spyOn(AcademyContext, "useAcademyDetail").mockReturnValue({
      ...defaultContext,
      reviews: { ...sampleReviewResponse, results: [] },
    });

    const { getByTestId } = renderWithProviders(<AcademyReviews />);

    await waitFor(() => {
      fireEvent.press(getByTestId("load-more"));
    });
  });

  it("renders error", async () => {
    jest.spyOn(AcademyContext, "useAcademyDetail").mockReturnValue({
      ...defaultContext,
      reviews: undefined,
    });

    renderWithProviders(<AcademyReviews />);
  });
});
