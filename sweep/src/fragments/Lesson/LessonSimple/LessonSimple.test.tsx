import { LessonSimple } from "./LessonSimple";
import { sampleLesson } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

describe("LessonSimple", () => {
  it("renders correctly", () => {
    renderWithProviders(<LessonSimple lesson={sampleLesson} />);
  });

  it("renders upcoming correctly", () => {
    renderWithProviders(
      <LessonSimple lesson={{ ...sampleLesson, done: false }} />
    );
  });
});
