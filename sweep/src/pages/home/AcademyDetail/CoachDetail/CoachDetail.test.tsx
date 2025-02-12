import { fireEvent, waitFor } from "@testing-library/react-native";

import { CoachDetail } from "./CoachDetail";
import * as CoachesAPI from "@services/products/coach";
import { sampleCoachDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<CoachDetail />", () => {
  it("handles bad response", () => {
    jest.spyOn(CoachesAPI, "getCoachDetails").mockResolvedValue(null);
    renderWithProviders(<CoachDetail />);
  });

  it("renders and handles like correctly", async () => {
    jest
      .spyOn(CoachesAPI, "getCoachDetails")
      .mockResolvedValueOnce(sampleCoachDetail);
    const { getByTestId } = renderWithProviders(<CoachDetail />);

    jest.spyOn(CoachesAPI, "likeCoach").mockResolvedValueOnce(null);
    await waitFor(() => fireEvent.press(getByTestId("like-button")));

    jest
      .spyOn(CoachesAPI, "getCoachDetails")
      .mockResolvedValueOnce({ ...sampleCoachDetail, is_liked: false });
    jest.spyOn(CoachesAPI, "likeCoach").mockResolvedValueOnce(true);
    await waitFor(() => fireEvent.press(getByTestId("like-button")));
  });
});
