import { fireEvent, waitFor } from "@testing-library/react-native";

import { CoachSNS, CoachSNSEdit } from "./CoachSNS";
import * as CoachFrontContext from "@contexts/front";
import * as CoachesAPI from "@services/products/coach";
import { sampleCoachDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<CoachSNS />", () => {
  it("renders correctly", async () => {
    const { getByTestId } = renderWithProviders(
      <CoachSNS instagram="instagram" blog="blog" />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("instagram")); // open instagram
      fireEvent.press(getByTestId("blog")); // open blog
    });
  });
});

describe("<CoachSNSEdit />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(CoachFrontContext, "useCoachFront").mockReturnValue({
      coach: sampleCoachDetail,
      reviews: undefined,
      lessons: [],
      loading: false,
      refresh: jest.fn(),
    });
  });

  it("renders and handles link open and sns update correctly", async () => {
    jest.spyOn(CoachesAPI, "updateCoachSNS").mockResolvedValueOnce(null);
    jest.spyOn(CoachesAPI, "updateCoachSNS").mockResolvedValue(true);

    const { getByTestId } = renderWithProviders(<CoachSNSEdit />);

    await waitFor(() => {
      fireEvent.press(getByTestId("instagram")); // open instagram
      fireEvent.press(getByTestId("blog")); // open blog

      fireEvent.press(getByTestId("open-modal"));
      fireEvent.press(getByTestId("저장")); // API Error

      fireEvent.press(getByTestId("저장")); // success
    });
  });

  it("handles bad config", async () => {
    jest.spyOn(CoachFrontContext, "useCoachFront").mockReturnValue({
      coach: undefined,
      reviews: undefined,
      lessons: [],
      loading: false,
      refresh: jest.fn(),
    });

    renderWithProviders(<CoachSNSEdit />);
  });
});
