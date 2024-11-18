import { fireEvent, waitFor } from "@testing-library/react-native";

import { Terms } from "./Terms";
import * as AgreementsAPI from "@services/auth/agreements";
import { sampleAgreements } from "@testdata/auth";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

describe("<Terms />", () => {
  it("renders and handles presses correctly", async () => {
    jest
      .spyOn(AgreementsAPI, "getAgreements")
      .mockResolvedValue(sampleAgreements);
    const { getByTestId } = renderWithProviders(<Terms />);

    await waitFor(() => {
      fireEvent.press(getByTestId("모두 동의 합니다."));
      fireEvent.press(getByTestId("모두 동의 합니다."));
      fireEvent.press(getByTestId("(필수) 약관 1"));
      fireEvent.press(getByTestId("(필수) 약관 1-right"));
      fireEvent.press(getByTestId("button"));
    });
  });

  it("handles error correctly", async () => {
    jest.spyOn(AgreementsAPI, "getAgreements").mockResolvedValue(null);
    waitFor(() => renderWithProviders(<Terms />));
  });
});
