import { fireEvent, waitFor } from "@testing-library/react-native";

import { CoachIntroduction, CoachIntroductionEdit } from "./CoachIntroduction";
import * as CoachFrontContext from "@contexts/front";
import * as CoachesAPI from "@services/products/coach";
import { sampleCoachDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<CoachIntroduction />", () => {
  it("renders short introduction correctly", () => {
    const { getByTestId } = renderWithProviders(
      <CoachIntroduction introduction="Hello, I'm a coach!" />
    );

    fireEvent(getByTestId("introduction"), "onTextLayout", {
      nativeEvent: {
        lines: new Array(1).fill({}),
      },
    });
  });

  it("renders long introduction correctly", async () => {
    const { getByTestId } = renderWithProviders(
      <CoachIntroduction introduction={"1\n2\n3\n4\n5\n6\n7\n8\n9\n10"} />
    );

    fireEvent(getByTestId("introduction"), "onTextLayout", {
      nativeEvent: {
        lines: new Array(6).fill({}),
      },
    });

    waitFor(() => {
      fireEvent.press(getByTestId("expand"));
      fireEvent.press(getByTestId("collapse"));
    });
  });
});

describe("<CoachIntroductionEdit />", () => {
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

  it("renders and handles update correctly", async () => {
    jest.spyOn(CoachesAPI, "updateCoachIntro").mockResolvedValueOnce(null);
    jest.spyOn(CoachesAPI, "updateCoachIntro").mockResolvedValue(true);

    const { getByTestId } = renderWithProviders(
      <CoachIntroductionEdit />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("open-intro"));
      fireEvent.press(getByTestId("저장")); // API error

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

    renderWithProviders(<CoachIntroductionEdit />);
  });
});
