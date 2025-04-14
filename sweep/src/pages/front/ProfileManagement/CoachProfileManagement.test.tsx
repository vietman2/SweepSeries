import { CoachProfileManagement } from "./CoachProfileManagement";
import * as CoachFrontContext from "@contexts/front";
import { sampleCoachDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Coach", () => ({
  CoachProfileImageEdit: () => <></>,
  CoachIntroductionEdit: () => <></>,
  CoachSNSEdit: () => <></>,
}));

describe("<CoachProfileManagement />", () => {
  it("renders correctly", async () => {
    jest.spyOn(CoachFrontContext, "useCoachFront").mockReturnValue({
      coach: sampleCoachDetail,
      reviews: undefined,
      lessons: [],
      loading: false,
      refresh: jest.fn(),
    });

    renderWithProviders(<CoachProfileManagement />);
  });

  it("handles loading", async () => {
    jest.spyOn(CoachFrontContext, "useCoachFront").mockReturnValue({
      coach: undefined,
      reviews: undefined,
      lessons: [],
      loading: false,
      refresh: jest.fn(),
    });

    renderWithProviders(<CoachProfileManagement />);
  });
});
