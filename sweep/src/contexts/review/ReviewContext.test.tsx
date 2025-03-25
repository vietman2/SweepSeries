import { TouchableOpacity, View } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import * as Router from "expo-router";

import { ReviewProvider, useReview } from "./ReviewContext";
import * as ReviewsAPI from "@services/products/reviews";
import { sampleLessonSimple } from "@testdata/calendar";
import { sampleTagOptions } from "@testdata/products";

jest.unmock("@contexts/review");

const TestComponent = () => {
  const { setSession } = useReview();

  return (
    <View>
      <TouchableOpacity
        testID="setSession"
        onPress={() => setSession(sampleLessonSimple)}
      />
    </View>
  );
};

describe("Review Context", () => {
  beforeEach(() => {
    jest.spyOn(Router, "usePathname").mockReturnValue("/reviews/new");
  });

  it("sets session correctly", async () => {
    jest.spyOn(Router, "usePathname").mockReturnValueOnce("/");
    jest.spyOn(ReviewsAPI, "getTagOptions").mockResolvedValue(sampleTagOptions);

    const { getByTestId } = render(
      <ReviewProvider>
        <TestComponent />
      </ReviewProvider>
    );

    await waitFor(() => fireEvent.press(getByTestId("setSession")));
  });

  it("handles api error", async () => {
    jest.spyOn(ReviewsAPI, "getTagOptions").mockResolvedValue(null);

    render(
      <ReviewProvider>
        <TestComponent />
      </ReviewProvider>
    );
  });

  it("handles misuse", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow();
  });
});
