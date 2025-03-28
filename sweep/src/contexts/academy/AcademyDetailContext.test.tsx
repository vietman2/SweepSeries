import { TouchableOpacity, View } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import * as Router from "expo-router";

import {
  AcademyDetailProvider,
  useAcademyDetail,
} from "./AcademyDetailContext";
import * as AcademiesAPI from "@services/products/academy";
import * as CoachesAPI from "@services/products/coach";
import * as NoticesAPI from "@services/products/notices";
import * as ProgramsAPI from "@services/products/programs";
import * as ReviewsAPI from "@services/products/reviews";
import {
  sampleAcademyDetail,
  sampleAcademyPrograms,
  sampleCoaches,
  sampleNotices,
  sampleReviewResponse,
  sampleReviews,
  sampleReviewSummary,
} from "@testdata/products";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

const TestComponent = () => {
  const { selectCoach, selectNotice, refresh } = useAcademyDetail();

  return (
    <View>
      <TouchableOpacity
        onPress={() => selectCoach(sampleCoaches[0])}
        testID="coach"
      />
      <TouchableOpacity
        onPress={() => selectNotice("1", sampleNotices[0])}
        testID="notice"
      />
      <TouchableOpacity onPress={refresh} testID="refresh" />
    </View>
  );
};

describe("<AcademyDetailContext />", () => {
  const renderPage = () => {
    return render(
      <AcademyDetailProvider>
        <TestComponent />
      </AcademyDetailProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.spyOn(Router, "useLocalSearchParams").mockReturnValue({ id: "1" });
    jest
      .spyOn(Router, "usePathname")
      .mockReturnValue("/home/academy/1/information");
    jest
      .spyOn(AcademiesAPI, "getAcademyDetail")
      .mockResolvedValue(sampleAcademyDetail);
    jest.spyOn(CoachesAPI, "getCoaches").mockResolvedValue(sampleCoaches);
  });

  it("should handle academy detail page", async () => {
    jest
      .spyOn(Router, "usePathname")
      .mockReturnValue("/home/academy/1/information");
    jest.spyOn(AcademiesAPI, "getAcademyDetail").mockResolvedValueOnce(null);

    const { getByTestId } = renderPage();

    jest
      .spyOn(AcademiesAPI, "getAcademyDetail")
      .mockResolvedValue(sampleAcademyDetail);
    await waitFor(() => {
      fireEvent.press(getByTestId("refresh"));
      jest.advanceTimersByTime(1000);
    }); // AcademyDetail api success
  });

  it("should handle academy coaches page", async () => {
    jest
      .spyOn(Router, "usePathname")
      .mockReturnValue("/home/academy/1/coaches");
    jest.spyOn(CoachesAPI, "getCoaches").mockResolvedValueOnce(null);

    const { getByTestId } = renderPage();

    jest.spyOn(CoachesAPI, "getCoaches").mockResolvedValue(sampleCoaches);
    await waitFor(() => {
      fireEvent.press(getByTestId("refresh"));
      jest.advanceTimersByTime(1000);
    }); // Coaches api success

    fireEvent.press(getByTestId("coach")); // Select coach
  });

  it("should handle academy notices page", async () => {
    jest
      .spyOn(Router, "usePathname")
      .mockReturnValue("/home/academy/1/notices");
    jest.spyOn(NoticesAPI, "getNotices").mockResolvedValueOnce(null);

    const { getByTestId } = renderPage();

    jest.spyOn(NoticesAPI, "getNotices").mockResolvedValue(sampleNotices);
    await waitFor(() => {
      fireEvent.press(getByTestId("refresh"));
      jest.advanceTimersByTime(1000);
    }); // Notices api success

    fireEvent.press(getByTestId("notice")); // Select notice
  });

  it("should handle academy programs page", async () => {
    jest
      .spyOn(Router, "usePathname")
      .mockReturnValue("/home/academy/1/programs");
    jest.spyOn(ProgramsAPI, "getPrograms").mockResolvedValueOnce(null);

    const { getByTestId } = renderPage();

    jest
      .spyOn(ProgramsAPI, "getPrograms")
      .mockResolvedValue(sampleAcademyPrograms);
    await waitFor(() => {
      fireEvent.press(getByTestId("refresh"));
      jest.advanceTimersByTime(1000);
    }); // Programs api success
  });

  it("should handle academy reviews page", async () => {
    jest
      .spyOn(Router, "usePathname")
      .mockReturnValue("/home/academy/1/reviews");
    jest
      .spyOn(ReviewsAPI, "getAcademyReviewSummary")
      .mockResolvedValue(sampleReviewSummary);
    jest.spyOn(ReviewsAPI, "getAcademyReviews").mockResolvedValueOnce(null);

    const { getByTestId } = renderPage();

    jest
      .spyOn(ReviewsAPI, "getAcademyReviews")
      .mockResolvedValue({ ...sampleReviewResponse, results: sampleReviews });
    await waitFor(() => {
      fireEvent.press(getByTestId("refresh"));
      jest.advanceTimersByTime(1000);
    }); // Reviews api success
  });

  it("should handle detail page", async () => {
    jest
      .spyOn(Router, "usePathname")
      .mockReturnValue("/home/academy/1/coaches/1");
    jest.spyOn(CoachesAPI, "getCoaches").mockResolvedValue(sampleCoaches);

    waitFor(() => renderPage());
  });

  it("should throw an error when used outside of AcademyDetailProvider", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow();
  });
});
