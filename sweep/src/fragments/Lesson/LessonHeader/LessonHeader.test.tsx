import { LessonHeader } from "./LessonHeader";
import { sampleLessons } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

describe("<LessonHeader />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <>
        <LessonHeader lesson={sampleLessons[0]} />
        <LessonHeader lesson={sampleLessons[1]} />
      </>
    );
  });
});
