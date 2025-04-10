import { fireEvent, waitFor } from "@testing-library/react-native";

import {
  AcademyReviewManagement,
  CoachReviewManagement,
} from "./ReviewManagement";
import * as FrontContexts from "@contexts/front";
import { sampleReviewResponse } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

const defaultFrontContext = {
  academies: [],
  coaches: [],
  isReady: true,
  selectAcademy: jest.fn(),
  selectCoach: jest.fn(),
  refreshProfile: jest.fn(),
};

jest.mock("@fragments/Review", () => ({
  ReviewsSummary: () => <div data-testid="reviews-summary" />,
  ReviewSimple: () => <div data-testid="review-simple" />,
}));

describe("<CoachReviewManagement />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(FrontContexts, "useCoachFront").mockReturnValue({
      coach: undefined,
      reviews: sampleReviewResponse,
      loading: false,
      refresh: jest.fn(),
    });
    jest.spyOn(FrontContexts, "useFront").mockReturnValue({
      ...defaultFrontContext,
      activeProfile: {
        uuid: "test-uuid",
        name: "test-name",
        image: "test-image",
        mode: "coach",
      },
    });
  });

  it("renders correctly and handles tab switching", async () => {
    const { getByTestId } = renderWithProviders(<CoachReviewManagement />);

    await waitFor(() => {
      fireEvent.press(getByTestId("tab-all"));
      fireEvent.press(getByTestId("tab-unanswered"));
    });
  });

  it("handles bad config (academy)", async () => {
    jest.spyOn(FrontContexts, "useFront").mockReturnValue({
      ...defaultFrontContext,
      activeProfile: {
        uuid: "test-uuid",
        name: "test-name",
        image: "test-image",
        mode: "academy",
      },
    });

    renderWithProviders(<CoachReviewManagement />);
  });

  it("handles bad config (no reviews)", async () => {
    jest.spyOn(FrontContexts, "useCoachFront").mockReturnValue({
      coach: undefined,
      reviews: undefined,
      loading: false,
      refresh: jest.fn(),
    });

    renderWithProviders(<CoachReviewManagement />);
  });
});

describe("<AcademyReviewManagement />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(FrontContexts, "useAcademyFront").mockReturnValue({
      academy: null,
      programs: [],
      notices: [],
      coaches: [],
      requests: [],
      reviews: sampleReviewResponse,
      facilityOptions: [],
      loading: false,
      refresh: jest.fn(),
    });
    jest.spyOn(FrontContexts, "useFront").mockReturnValue({
      ...defaultFrontContext,
      activeProfile: {
        uuid: "test-uuid",
        name: "test-name",
        image: "test-image",
        mode: "academy",
      },
    });
  });

  it("renders correctly and handles tab switching", async () => {
    const { getByTestId } = renderWithProviders(<AcademyReviewManagement />);

    await waitFor(() => {
      fireEvent.press(getByTestId("tab-all"));
      fireEvent.press(getByTestId("tab-unanswered"));
    });
  });

  it("handles bad config (academy)", async () => {
    jest.spyOn(FrontContexts, "useFront").mockReturnValue({
      ...defaultFrontContext,
      activeProfile: {
        uuid: "test-uuid",
        name: "test-name",
        image: "test-image",
        mode: "coach",
      },
    });

    renderWithProviders(<AcademyReviewManagement />);
  });

  it("handles bad config (no reviews)", async () => {
    jest.spyOn(FrontContexts, "useAcademyFront").mockReturnValue({
      academy: null,
      programs: [],
      notices: [],
      coaches: [],
      requests: [],
      reviews: undefined,
      facilityOptions: [],
      loading: false,
      refresh: jest.fn(),
    });

    renderWithProviders(<AcademyReviewManagement />);
  });
});
