import { fireEvent } from "@testing-library/react-native";

import { ReviewModal } from "./ReviewModal";
import * as ReviewContext from "@contexts/review";
import { sampleLesson } from "@testdata/calendar";
import { sampleTagOptions } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Lesson", () => ({
  LessonSimple: () => <div>LessonSimple</div>,
}));
jest.mock("@fragments/Review", () => ({
  ReviewInputs: () => <div>ReviewInputs</div>,
}));

describe("<ReviewModal />", () => {
  const defaultContext = {
    sessionToReview: sampleLesson,
    tagOptions: sampleTagOptions,
    setSession: jest.fn(),
  };

  beforeEach(() => {
    jest.spyOn(ReviewContext, "useReview").mockReturnValue(defaultContext);
  });

  it("should render null", () => {
    jest.spyOn(ReviewContext, "useReview").mockReturnValue({
      sessionToReview: null,
      tagOptions: undefined,
      setSession: jest.fn(),
    });
    renderWithProviders(<ReviewModal />);
  });

  it("should render correctly", () => {
    const { getByTestId } = renderWithProviders(<ReviewModal />);

    fireEvent.press(getByTestId("submit"));
  });
});
