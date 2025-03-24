import { AcademyReviews } from "./AcademyReviews";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Review", () => ({
  ReviewsHeader: () => "ReviewsHeader",
  ReviewSimple: () => "ReviewSimple",
}));

describe("<AcademyReviews />", () => {
  it("renders correctly", () => {
    renderWithProviders(<AcademyReviews />);
  });
});
