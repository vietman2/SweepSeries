import { fireEvent, waitFor } from "@testing-library/react-native";

import { CoachRequest } from "./CoachRequest";
import * as CoachesAPI from "@services/products/coach";
import { sampleCoaches } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<CoachRequest />", () => {
  it("handles accept", async () => {
    jest.spyOn(CoachesAPI, "acceptCoach").mockResolvedValueOnce(true);
    jest.spyOn(CoachesAPI, "acceptCoach").mockResolvedValueOnce(null);
    jest.spyOn(CoachesAPI, "rejectCoach").mockResolvedValueOnce(true);
    jest.spyOn(CoachesAPI, "rejectCoach").mockResolvedValueOnce(null);
    const { getByTestId } = renderWithProviders(
      <CoachRequest coach={sampleCoaches[0]} onRefresh={jest.fn()} />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("accept"));
      fireEvent.press(getByTestId("reject"));
    });

    await waitFor(() => {
      fireEvent.press(getByTestId("accept"));
      fireEvent.press(getByTestId("reject"));
    });
  });
});
