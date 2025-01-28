import { fireEvent, waitFor } from "@testing-library/react-native";
import * as Router from "expo-router";

import { ReadTerm } from "./ReadTerm";
import * as AgreementsAPI from "@services/auth/agreements";
import { sampleAgreement } from "@testdata/auth";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
}));

describe("<ReadTerm />", () => {
  beforeEach(() => {
    jest.spyOn(Router, "useLocalSearchParams").mockReturnValue({ id: "1" });
  });

  it("renders term correctly", async () => {
    jest
      .spyOn(AgreementsAPI, "getAgreementContent")
      .mockResolvedValue(sampleAgreement);

    const { getByTestId } = renderWithProviders(<ReadTerm />);

    await waitFor(() => fireEvent.press(getByTestId("닫기")));
  });

  it("handles api error", async () => {
    jest.spyOn(Router, "useLocalSearchParams").mockReturnValue({ id: "1" });
    jest.spyOn(AgreementsAPI, "getAgreementContent").mockResolvedValue(null);

    renderWithProviders(<ReadTerm />);
  });
});
