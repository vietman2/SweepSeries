import { fireEvent } from "@testing-library/react-native";

import { SessionsToReview } from "./SessionsToReview";
import { sampleLessonSimple } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));
jest.mock("@fragments/Lesson", () => ({
  LessonToReview: () => <></>,
}));

describe("<SessionsToReview />", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProviders(
      <SessionsToReview sessions={[sampleLessonSimple]} />
    );

    fireEvent.press(getByTestId("review-button"));
    fireEvent.scroll(getByTestId("scroll"), {
      nativeEvent: {
        contentOffset: { x: 252 },
        contentSize: { width: 1000, height: 500 },
        layoutMeasurement: { width: 300, height: 300 },
      },
    });
  });
});
