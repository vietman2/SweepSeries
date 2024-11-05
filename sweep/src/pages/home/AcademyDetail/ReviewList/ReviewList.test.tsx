import { ReviewList } from "./ReviewList";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Review", () => ({
  ReviewsHeader: () => "ReviewsHeader",
  ReviewSimple: () => "ReviewSimple",
}));

describe("<ReviewList />", () => {
  it("renders correctly", () => {
    renderWithProviders(<ReviewList />);
  });
});
