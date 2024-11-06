import { fireEvent } from "@testing-library/react-native";

import { ReviewManagement } from "./Reviews";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Review", () => ({
  ReviewsHeader: () => <div data-testid="reviews-header" />,
  ReviewSimple: () => <div data-testid="review-simple" />,
}));

describe("<ReviewManagement />", () => {
  it("renders correctly and handles tab switching", () => {
    const { getByTestId } = renderWithProviders(<ReviewManagement />);

    fireEvent.press(getByTestId("tab-all"));
    fireEvent.press(getByTestId("tab-unanswered"));
  });
});
