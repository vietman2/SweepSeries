import { ReviewSimple } from "./ReviewSimple";
import { sampleReviews } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("../Rating/RatingDisplay", () => ({
  RatingDiaplay: () => "RatingDiaplay",
}));

describe("<ReviewSimple />", () => {
  it("renders correctly", () => {
    renderWithProviders(<ReviewSimple review={sampleReviews[0]} />);
  });
});
