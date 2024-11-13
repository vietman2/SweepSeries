import * as Router from "expo-router";

import { LessonDetail } from "./LessonDetail";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
}));
jest.mock("@fragments/Lesson", () => ({
  LessonHeader: () => <div>LessonHeader</div>,
}));

describe("<LessonDetail />", () => {
  it("renders correctly", () => {
    jest
      .spyOn(Router, "useLocalSearchParams")
      .mockReturnValue({ id: "1" });

    renderWithProviders(<LessonDetail />);
  });
  
  it("renders correctly 2", () => {
    jest
      .spyOn(Router, "useLocalSearchParams")
      .mockReturnValue({ id: "2" });

    renderWithProviders(<LessonDetail />);
  });
});
