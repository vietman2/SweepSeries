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
    jest.spyOn(NoticesAPI, "getNotices").mockResolvedValue(sampleNotices);
    jest.spyOn(CoachesAPI, "getCoaches").mockResolvedValue(sampleCoaches);
    jest
      .spyOn(ProgramsAPI, "getPrograms")
      .mockResolvedValue(sampleAcademyPrograms);
    jest
      .spyOn(ReviewsAPI, "getAcademyReviewSummary")
      .mockResolvedValue(sampleReviewSummary);
    jest
      .spyOn(ReviewsAPI, "getAcademyReviews")
      .mockResolvedValue({ ...sampleReviewResponse, results: sampleReviews });
  });

  it("should handle data fetches", async () => {
    jest.spyOn(AcademiesAPI, "getAcademyDetail").mockResolvedValueOnce(null);
    jest.spyOn(CoachesAPI, "getCoaches").mockResolvedValueOnce(null);
    jest.spyOn(NoticesAPI, "getNotices").mockResolvedValueOnce(null);
    jest.spyOn(ProgramsAPI, "getPrograms").mockResolvedValueOnce(null);
    jest.spyOn(ReviewsAPI, "getAcademyReviews").mockResolvedValueOnce(null);

    const { getByTestId } = renderPage();

    await waitFor(() => {
      fireEvent.press(getByTestId("refresh"));
      jest.advanceTimersByTime(1000);
    }); // Api success
  });

  it("should handle coach detail page", async () => {
    jest
      .spyOn(Router, "usePathname")
      .mockReturnValue("/home/academy/1/coaches/1");

    const { getByTestId } = renderPage();

    await waitFor(() => fireEvent.press(getByTestId("coach")));
  });

  it("should handle notice detail page", async () => {
    jest
      .spyOn(Router, "usePathname")
      .mockReturnValue("/home/academy/1/notices/1");

    const { getByTestId } = renderPage();

    await waitFor(() => fireEvent.press(getByTestId("notice")));
  });

  it("should throw an error when used outside of AcademyDetailProvider", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow();
  });
});
