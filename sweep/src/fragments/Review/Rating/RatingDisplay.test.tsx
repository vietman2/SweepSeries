import { RatingDiaplay } from "./RatingDisplay";
import { renderWithProviders } from "@utils/test-utils";

describe("<RatingDiaplay />", () => {
  it("renders all stars correctly", () => {
    renderWithProviders(
      <>
        <RatingDiaplay rating={5} />
        <RatingDiaplay rating={4} />
        <RatingDiaplay rating={3} />
        <RatingDiaplay rating={2} />
        <RatingDiaplay rating={1} />
      </>
    );
  });
});
