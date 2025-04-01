import { fireEvent } from "@testing-library/react-native";

import {
  LessonSimple,
  LessonRequestSimple,
  LessonToReview,
} from "./LessonSimple";
import { sampleLesson, sampleLessonRequests } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

describe("<LessonSimple />", () => {
  it("renders correctly", () => {
    renderWithProviders(<LessonSimple lesson={sampleLesson} />);
  });

  it("renders upcoming correctly", () => {
    renderWithProviders(
      <LessonSimple lesson={{ ...sampleLesson, done: false }} />
    );
  });
});

describe("<LessonRequestSimple />", () => {
  it("renders correctly", () => {
    const { getAllByTestId } = renderWithProviders(
      <>
        <LessonRequestSimple
          lessonRequest={sampleLessonRequests[0]}
          checked={false}
          onCheck={jest.fn()}
        />
        <LessonRequestSimple
          lessonRequest={sampleLessonRequests[1]}
          checked={true}
          onCheck={jest.fn()}
        />
      </>
    );

    fireEvent.press(getAllByTestId("expand-button")[0]);
  });
});

describe("<LessonToReview />", () => {
  it("renders correctly", () => {
    renderWithProviders(<LessonToReview lesson={sampleLesson} />);
  });
});
