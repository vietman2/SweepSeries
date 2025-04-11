import { TouchableOpacity } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { AcademyFrontProvider, useAcademyFront } from "./AcademyFrontContext";
import * as FrontContext from "./FrontContext";
import * as LessonsAPI from "@services/calendar/lessons";
import * as AcademiesAPI from "@services/products/academy";
import * as CoachesAPI from "@services/products/coach";
import * as AcademyNoticesAPI from "@services/products/notices";
import * as ProgramsAPI from "@services/products/programs";
import * as ReviewsAPI from "@services/products/reviews";
import { sampleAcademyDetail, sampleReviewResponse } from "@testdata/products";

const TestComponent = () => {
  const { refresh } = useAcademyFront();

  return <TouchableOpacity onPress={refresh} testID="refresh" />;
};

const defaultProfile = {
  uuid: "uuid",
  name: "",
  image: "",
};
const defaultFrontContext = {
  academies: [],
  coaches: [],
  isReady: true,
  selectAcademy: jest.fn(),
  selectCoach: jest.fn(),
  refreshProfile: jest.fn(),
};

describe("<AcademyFrontContext />", () => {
  const renderPage = () => {
    return render(
      <FrontContext.FrontProvider>
        <AcademyFrontProvider>
          <TestComponent />
        </AcademyFrontProvider>
      </FrontContext.FrontProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.spyOn(FrontContext, "useFront").mockReturnValue({
      ...defaultFrontContext,
      activeProfile: {
        ...defaultProfile,
        mode: "academy",
      },
    });
    jest.spyOn(LessonsAPI, "getDailyLessons").mockResolvedValue([]);
    jest
      .spyOn(AcademiesAPI, "getAcademyDetail")
      .mockResolvedValue(sampleAcademyDetail);
    jest.spyOn(AcademiesAPI, "getFacilityOptions").mockResolvedValue([]);
    jest.spyOn(CoachesAPI, "getEmployedCoaches").mockResolvedValue([]);
    jest.spyOn(ProgramsAPI, "getPrograms").mockResolvedValue([]);
    jest.spyOn(AcademyNoticesAPI, "getNotices").mockResolvedValue([]);
    jest.spyOn(CoachesAPI, "getEmployedCoaches").mockResolvedValue({
      accepted: [],
      pending: [],
    });
    jest
      .spyOn(ReviewsAPI, "getAcademyReviews")
      .mockResolvedValue(sampleReviewResponse);
  });

  it("refreshes data when refresh button is pressed", async () => {
    const { getByTestId } = renderPage();

    await waitFor(() => {
      fireEvent.press(getByTestId("refresh"));
    });

    await waitFor(() => {
      jest.advanceTimersByTime(1000);
    });
  });

  it("handles api errors", async () => {
    jest.spyOn(LessonsAPI, "getDailyLessons").mockResolvedValueOnce(null);
    jest.spyOn(AcademiesAPI, "getFacilityOptions").mockResolvedValue(null);

    waitFor(() => renderPage());
  });

  it("handles bad config", async () => {
    jest.spyOn(FrontContext, "useFront").mockReturnValue({
      ...defaultFrontContext,
      activeProfile: {
        ...defaultProfile,
        mode: "coach",
      },
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
