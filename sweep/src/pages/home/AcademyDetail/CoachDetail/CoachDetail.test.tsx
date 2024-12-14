import { CoachDetail } from "./CoachDetail";
import * as CoachesAPI from "@services/products/coach";
import { sampleCoachDetail } from "@testdata/products";
import { waitFor } from "@testing-library/react-native";
import { renderWithProviders } from "@utils/test-utils";

describe("<CoachDetail />", () => {
  it("handles bad response", () => {
    jest.spyOn(CoachesAPI, "getCoachDetails").mockResolvedValue(null);
    renderWithProviders(<CoachDetail />);
  });

  it("renders correctly", async () => {
    jest
      .spyOn(CoachesAPI, "getCoachDetails")
      .mockResolvedValue(sampleCoachDetail);
    const { getByText } = renderWithProviders(<CoachDetail />);

    await waitFor(() => expect(getByText("코치 소개")).toBeTruthy());
  });
});
