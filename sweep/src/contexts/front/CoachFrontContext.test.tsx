import { TouchableOpacity } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { CoachFrontProvider, useCoachFront } from "./CoachFrontContext";
import * as FrontContext from "./FrontContext";
import * as LessonsAPI from "@services/calendar/lessons";
import * as CoachesAPI from "@services/products/coach";
import * as ReviewsAPI from "@services/products/reviews";
import { sampleCoachDetail, sampleReviewResponse } from "@testdata/products";

const TestComponent = () => {
  const { refresh } = useCoachFront();

  return <TouchableOpacity onPress={refresh} testID="refresh" />;
};

describe("<CoachFrontContext />", () => {
  const renderPage = () => {
    return render(
      <FrontContext.FrontProvider>
        <CoachFrontProvider>
          <TestComponent />
        </CoachFrontProvider>
      </FrontContext.FrontProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.spyOn(FrontContext, "useFront").mockReturnValue({
      academies: [],
      coaches: [],
      activeProfile: {
        uuid: "uuid",
        name: "",
        image: "",
        mode: "coach",
      },
      isReady: true,
      selectAcademy: jest.fn(),
      selectCoach: jest.fn(),
      refreshProfile: jest.fn(),
    });
    jest.spyOn(LessonsAPI, "getDailyLessons").mockResolvedValue([]);
    jest
      .spyOn(CoachesAPI, "getCoachDetails")
      .mockResolvedValue(sampleCoachDetail);
    jest
      .spyOn(ReviewsAPI, "getCoachReviews")
      .mockResolvedValue(sampleReviewResponse);
  });

  it("refreshes data on button press", async () => {
    const { getByTestId } = renderPage();

    await waitFor(() => {
      fireEvent.press(getByTestId("refresh"));
    });

    await waitFor(() => {
      jest.advanceTimersByTime(1000);
    });
  });

  it("handles api error", async () => {
    jest.spyOn(LessonsAPI, "getDailyLessons").mockResolvedValue(null);

    waitFor(() => renderPage());
  });

  it("handles bad config", async () => {
    jest.spyOn(FrontContext, "useFront").mockReturnValue({
      academies: [],
      coaches: [],
      activeProfile: {
        uuid: "uuid",
        name: "",
        image: "",
        mode: "academy",
      },
      isReady: true,
      selectAcademy: jest.fn(),
      selectCoach: jest.fn(),
      refreshProfile: jest.fn(),
    });

    waitFor(() => renderPage());
  });

  it("handles context misuse", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() =>
      render(
        <FrontContext.FrontProvider>
          <TestComponent />
        </FrontContext.FrontProvider>
      )
    ).toThrow();
  });
});
