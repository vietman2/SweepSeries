import { fireEvent, waitFor } from "@testing-library/react-native";

import { Recommendations } from "./Recommendations";
import * as AcademiesAPI from "@services/products/academy";
import { sampleAcademies } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<Recommendations />", () => {
  it("renders correctly", async () => {
    jest
      .spyOn(AcademiesAPI, "getRecommendations")
      .mockResolvedValueOnce(sampleAcademies);

    const { getByTestId } = renderWithProviders(
      <Recommendations refreshCount={0} />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("academy-1"));
    });
  });

  it("handles api error", async () => {
    jest.spyOn(AcademiesAPI, "getRecommendations").mockResolvedValueOnce(null);

    waitFor(() => renderWithProviders(<Recommendations refreshCount={0} />));
  });
});
