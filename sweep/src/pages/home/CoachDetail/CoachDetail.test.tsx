import { fireEvent, waitFor } from "@testing-library/react-native";

import { CoachDetail } from "./CoachDetail";
import * as CoachesAPI from "@services/products/coach";
import * as ReviewsAPI from "@services/products/reviews";
import {
  sampleCoachDetail,
  sampleCoachReviewResponse,
} from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Review", () => ({
  ReviewSimple: () => <></>,
  ReviewsSummary: () => <></>,
}));

describe("<CoachDetail />", () => {
  beforeEach(() => {
    jest
      .spyOn(CoachesAPI, "getCoachDetails")
      .mockResolvedValue(sampleCoachDetail);
    jest
      .spyOn(ReviewsAPI, "getCoachReviews")
      .mockResolvedValueOnce(sampleCoachReviewResponse);
  });

  it("handles bad response", () => {
    jest.spyOn(CoachesAPI, "getCoachDetails").mockResolvedValue(null);
    renderWithProviders(<CoachDetail />);
  });

  it("renders and handles like correctly", async () => {
    const { getByTestId } = renderWithProviders(<CoachDetail />);

    jest.spyOn(CoachesAPI, "likeCoach").mockResolvedValueOnce(true);
    await waitFor(() => fireEvent.press(getByTestId("like-button")));

    jest.spyOn(CoachesAPI, "likeCoach").mockResolvedValueOnce(null);
    await waitFor(() => fireEvent.press(getByTestId("like-button")));
  });

  it("renders not liked coach correctly", async () => {
    jest
      .spyOn(CoachesAPI, "getCoachDetails")
      .mockResolvedValue({ ...sampleCoachDetail, is_liked: false });
    waitFor(() => renderWithProviders(<CoachDetail />));
  });
});
