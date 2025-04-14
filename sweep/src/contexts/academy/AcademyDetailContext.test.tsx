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
      .spyOn(AcademiesAPI, "getAcademyDetail")
      .mockResolvedValue(sampleAcademyDetail);
    jest.spyOn(NoticesAPI, "getNotices").mockResolvedValue(sampleNotices);
    jest.spyOn(CoachesAPI, "getCoaches").mockResolvedValue(sampleCoaches);
    jest
      .spyOn(ProgramsAPI, "getPrograms")
      .mockResolvedValue(sampleAcademyPrograms);
    jest
      .spyOn(ReviewsAPI, "getAcademyReviews")
      .mockResolvedValue({
        ...sampleReviewResponse,
        results: sampleReviews,
        summary: sampleReviewSummary,
      });
  });

  it("should handle initial data fetch fail", async () => {
    jest.spyOn(AcademiesAPI, "getAcademyDetail").mockResolvedValueOnce(null);

    renderPage();
  });

  it("should handle data fetches and refresh (data fetch fail)", async () => {
    const { getByTestId } = renderPage();

    jest.spyOn(AcademiesAPI, "getAcademyDetail").mockResolvedValueOnce(null);

    await waitFor(() => {
      fireEvent.press(getByTestId("refresh"));
      jest.advanceTimersByTime(1000);
    }); // Api success
  });

  it("should handle coach detail page", async () => {
    const { getByTestId } = renderPage();

    await waitFor(() => fireEvent.press(getByTestId("coach")));
  });

  it("should handle notice detail page", async () => {
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
